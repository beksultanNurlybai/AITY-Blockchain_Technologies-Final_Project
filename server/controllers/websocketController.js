const WebSocket = require('ws');
const url = require('url');
const User = require('../models/User');

const userConnections = new Map();
const fileResponseHandlers = new Map();

async function on_login_event(data, user) {
    try {
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

function on_new_file_event(data) {
    const { request_id, content } = data;
    const handler = fileResponseHandlers.get(request_id);

    if (handler) {
        handler(content);
    } else {
        console.error(`No handler found for request_id: ${request_id}`);
    }
}

function on_resource_data_event(data) {
    const { user_id, content } = data;
    const userWs = userConnections.get(user_id);

    if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(JSON.stringify({
            event: 'resource_data_update',
            content: content,
        }));
    } else {
        console.error(`No WebSocket connection found for user: ${user_id}`);
    }
}

const initWebSocket = () => {
    wss = new WebSocket.Server({ port: 3001 });
    wss.on('connection', async (ws, req) => {
        const query = url.parse(req.url, true).query;
        if (query.key) {
            const key = query.key;
            try {
                const user = await User.findOne({ key });
                if (!user) {
                    console.log(`Client attempted connection with invalid key: ${key}`);
                    ws.send(JSON.stringify({ event: 'login_req', is_valid: false }));
                    ws.close();
                    return;
                }
                console.log(`Client connected with valid key: ${key}`);
                ws.send(JSON.stringify({ event: 'login_req', is_valid: true }));
                userConnections.set(user.user_id, ws);
    
                ws.on('message', (msg) => {
                    const data = JSON.parse(msg);
                    // console.log('Message from client app:', data.event);
                    switch (data.event) {
                        case 'login_res':
                            on_login_event(data, user);
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
            } catch (error) {
                console.error('Error validating key:', error);
                ws.send(JSON.stringify({ event: 'login_req', is_valid: false }));
                ws.close();
            }
        } else if (query.user_id) {
            const user_id = query.user_id;
            try {
                const user = await User.findOne({ user_id });
                if (!user) {
                    console.log(`User ${user_id} attempted connection.`);
                    ws.close();
                    return;
                }
                console.log(`User ${user_id} connected.`);
                userConnections.set(user_id, ws);
                
                sendMessageToClientApp(user.provider_id, { event: 'resource_data_req', user_id });

                ws.on('message', (msg) => {
                    const data = JSON.parse(msg);
                    console.log('Message from client app:', data.event);
                    if (data.event == 'stop_resource_data') {
                        sendMessageToClientApp(user.provider_id, { event: data.event });
                    } else {
                        console.log(`Unhandled event: ${data.event}`);
                    }
                });

                ws.on('close', async () => {
                    console.log('User disconnected');
                    userConnections.delete(user.user_id);
                });
            } catch (error) {
                console.error('Error finding user:', error);
                ws.close();
            }
        } else {
            console.log('Unknow user tried to connect.');
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

module.exports = { initWebSocket, sendMessageToClientApp, fileResponseHandlers };