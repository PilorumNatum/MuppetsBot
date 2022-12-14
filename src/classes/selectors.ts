import { AutocompleteInteraction, ChatInputCommandInteraction, ComponentType,
    SelectMenuInteraction, SelectMenuBuilder, ActionRowBuilder } from "discord.js";
import { MuppetsClient } from "../muppets-client";

function selector(customId:string, placeholder:string, ...options:{label:string, value:string}[]) {
    return new ActionRowBuilder<SelectMenuBuilder>()
    .addComponents(
        new SelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder)
            .addOptions(...options)
    )
}

const to_export = {
    async AddQuoteSelector(this:MuppetsClient, charName:string,
            customId:string):Promise<{content:string, components?:any[]}> {
        /*Reply _again_ to the interaction with inviting user to select a character's quote in the selector
        which will be created. The callback argument will be executed when a value of the
        selector is submitted.
        I insist on the _again_ : please deferReply or reply your interaction before run this function.*/
        const quotes = (await this.characterService.getCharacterWithName(charName)).quotes||[];
        if (quotes.length==0) {
            return {
                content:this.i18n("noSavedQuote_error", {charName:charName})
            };
        } else {
            const rows = [selector(
                customId, this.i18n("selectorPlaceholder"),...quotes.map(
                quote_obj => {
                    const quote = quote_obj.quote;
                    const label:string=quote.length>50?quote.slice(0,47)+'...':quote; 
                    return {
                        label:label,
                        value:quote_obj.id.toString()
                    }
                }
            ))];
            return {
                content:this.i18n("selectorMessage"),
                components:rows,
            };
            /*
            msg.createMessageComponentCollector({componentType:ComponentType.SelectMenu, time:15000})
                .on('collect', inter => {
                    if (inter.customId!==customId) return ;
                    callback(inter);
                });
            */
        }
    },
    async characterAutocomplete(this:MuppetsClient, interaction:AutocompleteInteraction):Promise<void> {
        const options = (await this.characterService.getCharactersNames()).map(
            name => ({name:name, value:name})
        );
        const characterFocusedValue = interaction.options.getFocused();
        const filtered = options.filter(choice => choice.name.toLowerCase().includes(characterFocusedValue.toLowerCase()));
        await interaction.respond(filtered);
    }
}
export = to_export;