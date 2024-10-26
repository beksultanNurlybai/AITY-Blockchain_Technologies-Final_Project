const WebSocket = require('ws');
const url = require('url');
const User = require('../models/User');

const userConnections = new Map();

async function on_login_event(data) {
    try {
        let user = await User.findOne({ key: data.key });
        if (!user) {
            console.error("Error: User not found");
            return;
        }
        user.resource = {
            processor_name: data.content.processor_name,
            cpu_count: data.content.cpu_count,
            ram_size: data.content.total_ram,
        };
        user.is_active = true;
        await user.save();
        console.log("Resource updated successfully for user:", user.user_id);
    } catch (error) {
        console.error("Error updating resource:", error);
    }
}


function on_new_file_event(data){
    console.log(data);
}

function on_resource_data_event(data){
    console.log(data);
}

const initWebSocket = () => {
    wss = new WebSocket.Server({ port: 3001 });
    wss.on('connection', async (ws, req) => {
        console.log('Client attempting connection via WebSocket');
        const query = url.parse(req.url, true).query;
        const key = query.key;

        try {
            const user = await User.findOne({ key });
            if (user) {
                console.log(`Client connected with valid key: ${key}`);
                ws.send(JSON.stringify({ event: 'login_req', is_valid: true }));
                userConnections.set(user.user_id, ws);

                ws.on('message', (msg) => {
                    const data = JSON.parse(msg);
                    console.log('Message from client app:', data.event);
                    switch (data.event) {
                        case 'login_res':
                            on_login_event(data);
                            break;
                        case 'new_file_res':
                            on_new_file_event(data);
                            break;
                        case 'resource_data_res':
                            on_resource_data_event(data);
                            break;
                        default:
                            console.log(`Unhandled event: ${data.event}`);
                    }
                });

                ws.on('close', async () => {
                    console.log('Client disconnected');
                    userConnections.delete(user.user_id);
                    try {
                        user.is_active = false;
                        console.log(user.is_active);
                        await user.save();
                    } catch (error) {
                        console.error("Error updating resource activity:", error);
                    }
                });
            } else {
                console.log(`Client attempted connection with invalid key: ${key}`);
                ws.send(JSON.stringify({ event: 'login_req', is_valid: false }));
                ws.close();
            }
        } catch (error) {
            console.error('Error validating key:', error);
            ws.send(JSON.stringify({ event: 'login_req', is_valid: false }));
            ws.close();
        }
    });
};

const sendMessageToClientApp = (provider_id, message) => {
    const ws = userConnections.get(provider_id);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.log(`Provider ${provider_id} is not connected or WebSocket is not open.`);
    }
};

module.exports = { initWebSocket, sendMessageToClientApp };