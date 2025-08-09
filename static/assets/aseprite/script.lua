-- export_tilemap.lua (JSON-only version)

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
    table.insert(parts, "    "..table.concat(rowparts, ","))
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

local outBase = nil
if sprite.filename and sprite.filename ~= "" then
  outBase = sprite.filename:gsub("%.%w+$", "")
else
  outBase = "aseprite_export"
end

local ok1 = os.execute(string.format('mkdir -p "%s" 2> /dev/null', outBase))
if not ok1 then
  pcall(function() os.execute(string.format('mkdir "%s" 2> nul', outBase)) end)
end

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

        local w = img.width
        local h = img.height

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

        local layerNameSafe = sanitize_filename(layer.name or "layer")
        local frameNum = cel.frame.frameNumber or cel.frame
        if type(frameNum) == "table" and frameNum.number then frameNum = frameNum.number end
        frameNum = tonumber(frameNum) or 1

        local baseName = string.format("%s/%s_frame%02d_tilemap", outBase, layerNameSafe, frameNum)

        local json_parts = {}
        table.insert(json_parts, "{")
        table.insert(json_parts, string.format('  "sprite": "%s",', json_escape(sprite.filename or "")))
        table.insert(json_parts, string.format('  "layer": "%s",', json_escape(layer.name or "")))
        table.insert(json_parts, string.format('  "frame": %d,', frameNum))
        table.insert(json_parts, string.format('  "width": %d,', w))
        table.insert(json_parts, string.format('  "height": %d,', h))
        table.insert(json_parts, '  "tiles": ' .. table_to_json_rows(tiles))
        table.insert(json_parts, "}")
        local json_text = table.concat(json_parts, "\n")
        write_file(baseName .. ".json", json_text)

        ::continue_cel::
      end
    end
  end
end

app.alert("Tilemap JSON export completed.\nFiles written into: " .. outBase)

