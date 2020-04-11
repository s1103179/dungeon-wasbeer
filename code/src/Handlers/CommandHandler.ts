import AdminHandler from './AdminHandler';
import IMessageInfo from '../Interfaces/IMessageInfo';
import Player from '../Objects/Player';
import MessageHandler from './MessageHandler';
import PlayerCardHandler from './PlayerCardHandler';
import TradeHandler from './TradeHandler';
import SettingsConstants from '../Constants/SettingsConstants';

export default class CommandHandler {

    public static async OnCommand(messageInfo:IMessageInfo, player:Player, content:string) {
        const words = content.split(' ');
        const command = words[0].substr(SettingsConstants.PREFIX.length).toLowerCase();
        words.shift();
        const args = words;
        content = content.slice(content.indexOf(' ')).trim();

        if (AdminHandler.OnCommand(messageInfo, player, command, args, content)) {
            return;
        } else if (TradeHandler.OnCommand(messageInfo, player, command, args)) {
            return;
        } else if (PlayerCardHandler.OnCommand(messageInfo, player, command, args)) {
            return;
        }
    }

    public static async HandleNormalMessage(messageInfo:IMessageInfo, player:Player) {
        MessageHandler.OnMessage(messageInfo, player);
    }
}