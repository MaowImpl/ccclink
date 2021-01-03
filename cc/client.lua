
-- Utils --

function writeFile(name, content)
    local file = fs.open(name, "w")
    file.write(content)
    file.close()
end

-- Websocket --

local ws, err = http.websocket("ws://localhost:8080") 

if ws then
    while true do
        ws.send(os.getComputerID())
        
        local name = ws.receive()
        local content = ws.receive()
        
        writeFile(name, content)
        print("Saved file: " .. name)
    end
end