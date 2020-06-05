import Card from '../Objects/Card';
import { MessageEmbed } from 'discord.js';
import SettingsConstants from '../Constants/SettingsConstants';
import Player from '../Objects/Player';
import EmojiConstants from '../Constants/EmojiConstants';
import ITradeInfo from '../Interfaces/ITradeInfo';
import CardService from '../Services/CardService';
import CharacterService from '../Services/CharacterService';
import CardManager from '../Managers/CardManager';

export default class CardEmbeds {

    public static GetCardEmbed(card:Card, amount:number = 1) {
        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT)
            .setAuthor(card.GetCategory(), CardService.GetIconByCategory(card.GetCategory()))
            .setTitle(card.GetName() + (amount == 1 ? '' : ' (x'+ amount + ')'))
            .setDescription(card.GetDescription())
            .setFooter(`Seizoen ${card.GetSeason()}`)
            .setImage(card.GetImageUrl())
            .addField('Level', card.GetRankString());

        const modifiers = card.GetModifiers();
        const modifierClass = card.GetModifierClass();

        if (modifiers.length > 0) {
            embed.addField('Modifiers', CardService.ParseModifierArrayToEmbedString(modifiers),  true)
        }

        if (modifierClass) {
            embed.addField('Class', `${CharacterService.GetClassEmoji(modifierClass)} ${modifierClass.toString()}`, true);
        }

        return embed;
    }

    public static GetCardStatsEmbed(cards:any) {
        const stats:any = {};
        for (const card of cards) {
            if (stats[card.category] == null) {
                stats[card.category] = [0, 0, 0, 0, 0];
            }

            stats[card.category][card.rank - 1]++;
        }

        const embed = new MessageEmbed()
            .setTitle('Card statistics')
            .setDescription('Total: ' + cards.length + '\nRank 1/2/3/4/5')

        for (const key in stats) {
            if ({}.hasOwnProperty.call(stats, key)) {
                const list = stats[key];
                embed.addField(key, list.join('/'));
            }
        }

        return embed;
    }

    public static GetPlayerCardListEmbed(player:Player, page?:number) {
        const playerCards = player.GetCards();

        const cardsAmount = CardManager.GetCardList().length;

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT)
            .setTitle('De kaarten van ' + player.GetDiscordName())

        var split = SettingsConstants.CARD_AMOUNT_SPLIT_PAGES;
        var pages = Math.ceil(playerCards.length/split);

        if (page != null) {
            page = ((page - 1) % (pages)) + 1;
        }

        var start = page == null ? 0 : (page-1) * split;
        var end = page == null ? playerCards.length : Math.min(playerCards.length, page * split);

        if (page != null) {
            embed.setFooter(`${start + 1}-${end} van de ${playerCards.length} kaarten`);
        }

        var list = '';

        for (let i = start; i < end; i++) {
            const playerCard = playerCards[i];
            if (playerCard == null) {
                continue;
            }
            const card = playerCard.GetCard();
            const amount = playerCard.GetAmount();
            list += EmojiConstants.STARS[card.GetRank()] + CardService.GetIconEmojiByCategory(card.GetCategory()) + ( playerCard.IsEquipped() ? ' ✅' : '') + ' ' + card.GetName() + (amount == 1 ? '' : ' (x' + amount + ')') + CardService.ParseCardModifersToEmbedString(card) + '\n';
        }

        embed.setDescription(`Unieke kaarten: ${playerCards.length} van de ${cardsAmount}\n\n${list}`);

        return embed;
    }

    public static GetTradeEmbed(tradeInfo:ITradeInfo) {
        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT)
            .setImage(tradeInfo.yourCard.GetCard().GetImageUrl())
            .setThumbnail(tradeInfo.theirCard.GetCard().GetImageUrl());

        return embed;
    }
}