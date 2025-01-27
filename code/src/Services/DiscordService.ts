import { Channel, Client, Guild, GuildMember, MessageEmbed, TextChannel, MessageAttachment } from 'discord.js';
import DiscordUtils from '../Utils/DiscordUtils';
import { Utils } from '../Utils/Utils';

export default class DiscordService {

    private static client: Client;

    public static SetClient(client: Client) {
        if (this.client != null) {
            throw new Error('Client can only be set once.');
        }

        this.client = client;
    }

    public static async FindMember(searchKey: string, guild: Guild, fuzzy: Boolean = false) {
        // TODO: Research how fetching with query works. Does it work for both displayName and username?
        // For now we just fetch all.
        var foundMember = await this.FindMemberById(searchKey, guild);
        if (foundMember) {
            return foundMember;
        }

        await guild.members.fetch();

        const lowerMember = searchKey.toLowerCase();
        foundMember = guild.members.cache.find(member => {
            return member.displayName.toLowerCase() == lowerMember || member.user.username.toLowerCase() == lowerMember;
        });

        if (foundMember) {
            return foundMember;
        }

        if (fuzzy) {
            return guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(lowerMember) || member.user.username.toLowerCase().includes(lowerMember);
            });
        }

        return null;
    }

    public static async FindMemberById(searchKey: string, guild: Guild) {
        const id = DiscordUtils.GetMemberId(searchKey);
        if (id) {
            const foundMember = guild.members.cache.get(id) || guild.members.fetch(id);
            if (foundMember != null) {
                return foundMember;
            }
        }
    }

    public static FindChannel(channelId: string, guild?: Guild) {
        var channel = this.FindChannelById(channelId, guild);

        if (channel == null && guild != null) {
            // Guild has already been fetched in FindChannelById
            return guild.channels.cache.find(channel => channel.name.toLowerCase() == channelId.toLowerCase());
        }
        return undefined;
    }

    public static async FindChannelById(searchKey: string, guild?: Guild) {
        const id = DiscordUtils.GetChannelId(searchKey);
        if (id) {
            var foundChannel;
            if (guild) {
                foundChannel = guild.channels.cache.get(id);
                if (!foundChannel) {
                    await guild.fetch();
                    foundChannel = guild.channels.cache.get(id);
                }
            } else {
                foundChannel = this.client.channels.cache.get(id) || await this.client.channels.fetch(id);
            }

            if (foundChannel != null) {
                return foundChannel;
            }
        }
    }

    public static async FindMessageById(messageId: string, channel: TextChannel) {
        return await channel.messages.fetch(messageId);
    }

    public static async FindUserById(userId: string) {
        return this.client.users.cache.get(userId) || await this.client.users.fetch(userId);
    }

    public static FindGuild(guildId: string) {
        return this.client.guilds.cache.get(guildId);
    }

    public static IsMemberAdmin(member: GuildMember) {
        return member.hasPermission('ADMINISTRATOR');
    }

    public static async SendEmbed(channel: Channel, embed: MessageEmbed, content?: string) {
        const textChannel: TextChannel = <TextChannel>channel;
        try {
            return await (content ? textChannel.send(content, embed) : textChannel.send(embed));
        } catch (error) {
            // Error
        }
    }

    public static async SendMessage(channel: Channel, message: string, embed?: MessageEmbed, attachments?: Array<MessageAttachment>) {
        try {
            const textChannel: TextChannel = <TextChannel>channel;
            if (embed) {
                return await this.SendEmbed(textChannel, embed, message);
            }
            if (attachments != null) {
                return await textChannel.send(message, attachments);
            } else {
                return await textChannel.send(message);
            }

        } catch (error) {
            // Was not able to send message.
            console.log(`(${Utils.GetNowString()}) ${error}`);
        }
    }

    public static async ReplyMessage(textChannel: TextChannel, member: GuildMember, message: string, embed?: MessageEmbed, attachments?: Array<MessageAttachment>) {
        const reply = `<@${member.user}> ${message}`;

        if (embed) {
            return await this.SendEmbed(textChannel, embed, reply);
        }

        if (attachments != null) {
            return await textChannel.send(reply, attachments);
        } else {
            return await textChannel.send(reply);
        }
    }

    public static GetMessageAttachment(data: any, name: string) {
        return new MessageAttachment(data, name);
    }
}