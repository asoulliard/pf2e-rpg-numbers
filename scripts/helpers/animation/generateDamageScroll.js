import { getFontScale, findTypeWithLargestTotal, getVisibleAndMsgVisibleUsers } from "../anim.js";
import { getSetting } from "../misc.js";
import { getIWR } from "../rollTerms.js";

/**
 * Generates damage scrolling text for a passed in list of damage values
 * @param {{type: string, value: string}[]} dmg_list list of type and value
 * @param {string[]} targets list of token ids
 */
export async function generateDamageScroll(dmg_list, isCrit, targets, msg) {
    const settings = {
        fontSize: getSetting("font-size"),
        jitter: getSetting("jitter"),
        duration: getSetting("duration") * 1000,
        animScale: getSetting("animation-scale"),
        waitTime: getSetting("wait-time-between-numbers") - getSetting("duration") * 1000,
        onlyGM: getSetting("show-only-GM"),
        topOffsetPercentage: getSetting("top-offset") / 100,
        showTotal: getSetting("show-total"),
    };

    const colors = {
        bludgeoning: "black",
        piercing: "black",
        slashing: "black",
        acid: "black",
        bleed: "black",
        chaotic: "black",
        cold: "black",
        electricity: "black",
        evil: "black",
        fire: "black",
        force: "black",
        good: "black",
        lawful: "black",
        mental: "black",
        poison: "black",
        healing: "black",
        sonic: "black",
        spirit: "black",
        vitality: "black",
        void: "black",
        "": "0xffffff",
        precision: "black",
    };

    const style = {
        fill: "black",
        fontSize: settings.fontSize,
        align: "center",
        dropShadow: true,
        dropShadowColor: "white",
        stroke: "white",
        strokeThickness: 5,
        fontFamily: "Persona",
        letterSpacing: -30,
    };

    const seq = new Sequence();

    for (const target_id of targets) {
        const tok = game.canvas.tokens.get(target_id);
        const size = tok.document.texture.scaleY * tok.document.width;
        const topOffset = size * settings.topOffsetPercentage;
        const usersToPlayFor = settings.onlyGM
            ? game.users.filter((u) => u.isGM).map((u) => u.id)
            : getVisibleAndMsgVisibleUsers({ token: tok, whisper: msg.whisper });

        Sequencer.Presets.add("tokenPop", (effect) => {
            return effect
                .atLocation(tok, { offset: { y: topOffset }, gridUnits: true })
                .anchor({ x: 0.5, y: 0.5 })
                .duration(settings.duration)
                .scaleIn(0.5, 0.4 * settings.duration)
                .fadeOut(0.1 * settings.duration)
                .aboveInterface()
                .forUsers(usersToPlayFor);
        }, true);

        Sequencer.Presets.add("popUp", (effect, level = 0) => {
            return effect
                .animateProperty("sprite", "position.y", {
                    from: 0,
                    to: (-size * (1 + level)) * settings.animScale,
                    duration: 0.4 * settings.duration,
                    gridUnits: true,
                });
        }, true);

        Sequencer.Presets.add("popDown", (effect, level = 0) => {
            return effect
                .animateProperty("sprite", "position.y", {
                    from: 0,
                    to: (size * (1 + level)) * settings.animScale,
                    duration: 0.4 * settings.duration,
                    gridUnits: true,
                });
        }, true);

        if (usersToPlayFor.length === 1 && game.users.some((u) => u.isGM && u.id === usersToPlayFor[0])) {
            style.stroke = "rgb(0, 100, 100)";
        }

        const dmgListFiltered = dmg_list.filter((d) => d.value > 0);

        if (settings.showTotal) {
            const totalDamage = dmgListFiltered.reduce((tot_dmg, curr_dmg) => tot_dmg + curr_dmg.value, 0);
            style.fontSize = settings.fontSize * getFontScale("percentMaxHealth", totalDamage, tok) * 1.1;
            style.fill = colors[findTypeWithLargestTotal(dmg_list)] ?? "black";

            seq.effect()
                .syncGroup(`${msg.id}-total`)
                .text(`${totalDamage}`, style)
                .preset("popUp")
                .preset("tokenPop");
        }

        // Loop through dmg_list instead of dmgListFiltered to account for IWR indicators. Always show dmg.
        dmg_list.forEach((dmg, index) => {
            style.fontSize = settings.fontSize * getFontScale("percentMaxHealth", dmg.value, tok);
            style.fill = colors[dmg.type] ?? "black";

            const attributes = msg.target.actor.attributes;
            const iwr = getIWR(attributes, dmg.type);

            if (isCrit && (index === 0)) {
                seq.effect()
                    .syncGroup(`${msg.id}-total`)
                    .file("Images/Persona/Assets/Text/Critical.svg")
                    .scale(0.75)
                    .preset("popUp", 1)
                    .preset("tokenPop");
            }

            if (iwr["immunity"]) {
                seq.effect()
                    .syncGroup(`${msg.id}-breakdown-${index}`)
                    .file("Images/Persona/Assets/Text/Immune.svg")
                    .scale(0.5)
                    .waitUntilFinished(settings.waitTime)
                    .preset("popUp")
                    .preset("tokenPop");
            }

            else {
                if (iwr["resistance"]) {
                    seq.effect()
                        .syncGroup(`${msg.id}-breakdown-${index}`)
                        .file("Images/Persona/Assets/Text/Resist.svg")
                        .scale(0.5)
                        .preset("popDown", 1)
                        .preset("tokenPop");
                }

                if (iwr["weakness"]) {
                    seq.effect()
                        .syncGroup(`${msg.id}-breakdown-${index}`)
                        .file("Images/Persona/Assets/Text/Weak.svg")
                        .scale(0.5)
                        .preset("popUp", ((isCrit && (index === 0)) ? 2 : 1))
                        .preset("tokenPop");
                }

                seq.effect()
                    .syncGroup(`${msg.id}-breakdown-${index}`)
                    .text(`${dmg.value}`, style)
                    .waitUntilFinished(settings.waitTime)
                    .preset("popUp")
                    .animateProperty("sprite", "scale.x", {
                        from: 0,
                        to: 1,
                        duration: 0.4 * settings.duration,
                        gridUnits: true,
                    })
                    .animateProperty("sprite", "scale.y", {
                        from: 0,
                        to: 1,
                        duration: 0.4 * settings.duration,
                        gridUnits: true,
                    })
                    .preset("tokenPop")
                    .zIndex(2);
            }
        });
    }

    await seq.play();
}