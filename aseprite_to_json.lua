local function sanitize_filename(s)
  s = s:gsub("[<>:\\/%%\"%|%?%*]", "_")
  s = s:gsub("%s+", "_")
  return s
end

local function write_file(path, text)
  local f, err = io.open(path, "w")
  if not f then
    app.alert("Can't write file: "..tostring(err).."\nPath: "..tostring(path))
    return false
  end
  f:write(text)
  f:close()
  return true
end

local function json_escape(s)
  s = s:gsub("\\", "\\\\")
  s = s:gsub("\"", "\\\"")
  s = s:gsub("\n", "\\n")
  s = s:gsub("\r", "\\r")
  return s
end

-- Flattened JSON output for tiles: a single array of tile objects with x,y,i,f
local function table_to_json_flat_with_xy(tiles)
  local parts = {}
  table.insert(parts, "[")
  local tileParts = {}
  for y = 1, #tiles do
    local row = tiles[y]
    for x = 1, #row do
      local cell = row[x]
      table.insert(tileParts,
        string.format('{"x":%d,"y":%d,"i":%d,"f":%d}', x - 1, y - 1, cell.i, cell.f)
      )
    end
  end
  table.insert(parts, "  " .. table.concat(tileParts, ","))
  table.insert(parts, "]")
  return table.concat(parts, "\n")
end

-- main
local sprite = app.activeSprite
if not sprite then
  app.alert("No active sprite open.")
  return
end

local outBase
if sprite.filename and sprite.filename ~= "" then
  outBase = sprite.filename:gsub("%.%w+$", "")
else
  outBase = "aseprite_export"
end

-- Step 1: Check if there is any tilemap info
local hasTilemap = false
for _,layer in ipairs(sprite.layers) do
  if layer.isTilemap then
    for _,cel in ipairs(sprite.cels) do
      if cel.layer == layer and cel.image then
        hasTilemap = true
        break
      end
    end
    if hasTilemap then break end
  end
end

if not hasTilemap then
  app.alert("No tilemap data found. Nothing exported.")
  return
end

-- Step 2: Create folder only if needed
local ok1 = os.execute(string.format('mkdir -p "%s" 2> /dev/null', outBase))
if not ok1 then
  pcall(function() os.execute(string.format('mkdir "%s" 2> nul', outBase)) end)
end

-- Step 3: Export JSON (all tilemaps in one file)
local all_tilemaps = {}

for _,layer in ipairs(sprite.layers) do
  if layer.isTilemap then
    local layerCels = {}
    for _,cel in ipairs(sprite.cels) do
      if cel.layer == layer then
        table.insert(layerCels, cel)
      end
    end

    if #layerCels > 0 then
      for _,cel in ipairs(layerCels) do
        local img = cel.image
        if not img then goto continue_cel end

        local w, h = img.width, img.height
        local tiles = {}
        for y = 0, h-1 do
          local row = {}
          for x = 0, w-1 do
            local raw = img:getPixel(x, y)
            local idx = app.pixelColor.tileI(raw)
            local flags = app.pixelColor.tileF(raw)
            table.insert(row, { i = idx, f = flags })
          end
          table.insert(tiles, row)
        end

        local frameNum = cel.frame.frameNumber or cel.frame
        if type(frameNum) == "table" and frameNum.number then frameNum = frameNum.number end
        frameNum = tonumber(frameNum) or 1

        table.insert(all_tilemaps, {
          layer = layer.name or "",
          frame = frameNum,
          width = w,
          height = h,
          tiles = tiles
        })

        ::continue_cel::
      end
    end
  end
end

-- Compose JSON output
local json_parts = {}
table.insert(json_parts, "{")
table.insert(json_parts, string.format('  "sprite": "%s",', json_escape(sprite.filename or "")))
table.insert(json_parts, '  "tilemaps": [')

for i, tilemap in ipairs(all_tilemaps) do
  table.insert(json_parts, "    {")
  table.insert(json_parts, string.format('      "layer": "%s",', json_escape(tilemap.layer)))
  table.insert(json_parts, string.format('      "frame": %d,', tilemap.frame))
  table.insert(json_parts, string.format('      "width": %d,', tilemap.width))
  table.insert(json_parts, string.format('      "height": %d,', tilemap.height))
  table.insert(json_parts, '      "tiles": ' .. table_to_json_flat_with_xy(tilemap.tiles))
  if i < #all_tilemaps then
    table.insert(json_parts, "    },")
  else
    table.insert(json_parts, "    }")
  end
end

table.insert(json_parts, "  ]")
table.insert(json_parts, "}")

write_file(outBase .. "_tilemaps.json", table.concat(json_parts, "\n"))

app.alert("Tilemap JSON export completed.\nFile written: " .. outBase .. "_tilemaps.json")

