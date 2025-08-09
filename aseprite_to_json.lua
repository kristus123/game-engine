local function sanitize_filename(s)
  s = s:gsub("[<>:\\/%%\"%|%?%*]", "_")
  s = s:gsub("%s+", "_")
  return s
end

local function write_file(path, text)
  local f, err = io.open(path, "w")
  if not f then
    app.alert("Can't write file: " .. tostring(err) .. "\nPath: " .. tostring(path))
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

local function table_to_json_rows(tiles)
  local parts = {}
  table.insert(parts, "[")
  for y = 1, #tiles do
    local row = tiles[y]
    table.insert(parts, "  [")
    local rowparts = {}
    for x = 1, #row do
      local cell = row[x]
      table.insert(rowparts, string.format('{"i":%d,"f":%d}', cell.i, cell.f))
    end
    table.insert(parts, "    " .. table.concat(rowparts, ","))
    if y < #tiles then
      table.insert(parts, "  ],")
    else
      table.insert(parts, "  ]")
    end
  end
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

-- Step 1: Check tilemap presence
local hasTilemap = false
for _, layer in ipairs(sprite.layers) do
  if layer.isTilemap then
    for _, cel in ipairs(sprite.cels) do
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

-- Step 2: Gather all data into one table
local exportData = {
  sprite = sprite.filename or "",
  tilemaps = {}
}

for _, layer in ipairs(sprite.layers) do
  if layer.isTilemap then
    for _, cel in ipairs(sprite.cels) do
      if cel.layer == layer and cel.image then
        local img = cel.image
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

        table.insert(exportData.tilemaps, {
          layer = layer.name or "",
          frame = frameNum,
          width = w,
          height = h,
          tiles = tiles
        })
      end
    end
  end
end

-- Step 3: Convert to JSON string
local json_parts = {}
table.insert(json_parts, "{")
table.insert(json_parts, string.format('  "sprite": "%s",', json_escape(exportData.sprite)))
table.insert(json_parts, '  "tilemaps": [')

for i, tm in ipairs(exportData.tilemaps) do
  table.insert(json_parts, "    {")
  table.insert(json_parts, string.format('      "layer": "%s",', json_escape(tm.layer)))
  table.insert(json_parts, string.format('      "frame": %d,', tm.frame))
  table.insert(json_parts, string.format('      "width": %d,', tm.width))
  table.insert(json_parts, string.format('      "height": %d,', tm.height))
  table.insert(json_parts, '      "tiles": ' .. table_to_json_rows(tm.tiles))
  if i < #exportData.tilemaps then
    table.insert(json_parts, "    },")
  else
    table.insert(json_parts, "    }")
  end
end

table.insert(json_parts, "  ]")
table.insert(json_parts, "}")

-- Step 4: Save one JSON file
write_file(outBase .. "_tilemaps.json", table.concat(json_parts, "\n"))

app.alert("Tilemap JSON export completed.\nFile written: " .. outBase .. "_tilemaps.json")

