require('dotenv').config();

import './Utils/MonkeyPatches';
import './Providers/SQL';

import BotManager from './Managers/BotManager';
import Discord from './Providers/Discord';

class Main {

    constructor() {
        Discord.SetEventReadyCallback(BotManager.OnReady);
        Discord.SetEventMessageCallback(BotManager.OnMessage);
        Discord.SetEventReactionAddCallback(BotManager.OnReaction);
        Discord.SetEventReactionRemoveCallback(BotManager.OnReaction);
        Discord.Init();
    }
}

new Main();