import SettingsConstants from '../Constants/SettingsConstants';
import Battle from '../Objects/Battle';
import { MessageEmbed } from 'discord.js';
import Character from '../Objects/Character';

export default class BattleEmbeds {

    public static GetBattleInfoEmbed(battle:Battle) {
        const monster = battle.GetMonster();

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.MONSTER)
            .setAuthor(monster.GetCategory(), 'https://cdn.discordapp.com/attachments/694331679204180029/698606955496734781/unknown.png')
            .setTitle(monster.GetName())
            .setDescription(monster.GetDescription())
            .setImage(monster.GetImageUrl())
            .addField('Level', monster.GetLevelString())
            .addField('Health', `${battle.GetCurrentMonsterHealth()}/${monster.GetHealth()}`, true)
            .addField('Strength', monster.GetAttackStrength(), true)
            .addField('Attack', monster.GetAttackRoll(), true)

        return embed;
    }

    public static GetBattleEmbed(battle:Battle, character:Character, roll1?:number, roll2?:number, roll3?:number, roll4?:number, playerWon?:boolean, damage?:number, crit?:boolean) {
        const monster = battle.GetMonster();

        const characterName = character.GetName();
        const characterAttack = character.GetAttackRoll();
        const characterStrength = character.GetAttackStrength();
        const monsterName = monster.GetName();
        const monsterAttack = monster.GetAttackRoll();
        const monsterStrength = monster.GetAttackStrength();

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT)
            .setAuthor('Aanval')
            .setThumbnail(monster.GetImageUrl())
            .setTitle(`${characterName} VS ${monsterName}`)
            .setDescription('-- Statistieken --')
            .addField(`${characterName}`, `Health: ${character.GetCurrentHealth()}/${character.GetMaxHealth()}\n${character.GetAttackName()}: ${characterStrength}\nAttack: ${characterAttack}`, true)
            .addField(`${monsterName}`, `Health: ${battle.GetCurrentMonsterHealth()}/${battle.GetMaxMonsterHealth()}\nStrength: ${monsterStrength}\nAttack: ${monsterAttack}`, true)
            .addField('--------------------------------', '-- Rolls --');

        if (roll1 != null && roll2 != null) {
            var message = `D20 = ${roll1}`;
            if (characterAttack > 1) {
                message += `\nD${characterAttack} = ${roll2}`;
            }

            embed.addField(`${characterName}`, message += `\nTotaal = ${roll1 + roll2}`, true);
            if (roll3 != null && roll4 != null) {
                var message = `D20 = ${roll3}`;
                if (monsterAttack > 1) {
                    message += `\nD${monsterAttack} = ${roll4}`;
                }
                embed.addField(`${monsterName}`, message + `\nTotaal = ${roll3 + roll4}`, true);
            } else if (roll3 != null) {
                var message = `D20 = ${roll3}`;
                if (monsterAttack > 1) {
                    message += `\nRolt de D${monsterAttack}...`;
                }
                embed.addField(`${monsterName}`, message, true);
            } else {
                embed.addField(`${monsterName}`, 'Rolt de D20...', true);
            }
        } else if (roll1 != null) {
            var message = `D20 = ${roll1}`;
            if (characterAttack > 1) {
                message += `\nRolt de D${characterAttack}...`;
            }

            embed.addField(`${characterName}`, message, true);
        } else {
            embed.addField(`${characterName}`, 'Rolt de D20...', true);
        }

        if (playerWon != null) {
            embed.addField('--------------------------------', '-- Resultaat --');
            if (playerWon) {
                var attackDescription = character.GetRandomAttackDescription(crit);
                if (!attackDescription.includes('[damage]')) {
                    attackDescription += '\nJe doet [damage] damage op de [monster].'
                }
                embed.addField(`${characterName} wint${crit ? ' met een crit' : ''}!`, attackDescription.replace('[damage]', damage?.toString() || '').replace('[monster]', monsterName || ''));
                embed.setColor(SettingsConstants.COLORS.GOOD)
            } else {

                var attackDescription = crit ? battle.GetMonsterAttackCritDescription() : battle.GetMonsterAttackDescription();
                if (!attackDescription.includes('[damage]')) {
                    attackDescription += '\nHij doet [damage] damage.'
                }
                embed.addField(`De ${monsterName} wint${crit ? ' met een crit' : ''}!`, attackDescription.replace('[damage]', damage?.toString() || '') );
                embed.setColor(SettingsConstants.COLORS.BAD)
            }
        }

        return embed;
    }
}