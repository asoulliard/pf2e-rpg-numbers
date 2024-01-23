import { debugLog, MODULE_ID } from "./helpers/misc.js"

Hooks.on("init", () => {
    const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

    game.settings.register("pf2e-rpg-numbers", "enabled", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.enabled.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
    game.settings.register("pf2e-rpg-numbers", "dmg-enabled", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.enabled.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
    game.settings.register("pf2e-rpg-numbers", "font-size", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.font-size.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.font-size.hint"),
        scope: "world",
        config: true,
        default: 20,
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "max-font-scale", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.max-font-scale.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.max-font-scale.hint"),
        scope: "world",
        config: true,
        default: 3,
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "top-offset", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.top-offset.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.top-offset.hint"),
        scope: "world",
        config: true,
        default: -25,
        range: {
            min: -100,
            max: 100,
            step: 5
        },
        type: Number,
    });

    game.settings.register("pf2e-rpg-numbers", "show-total", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.show-total.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.show-total.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("pf2e-rpg-numbers", "number-scale-type", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.number-scale-type.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.number-scale-type.hint"),
        scope: "world",
        config: true,
        default: "percentMaxHealth",
        type: String,
        choices: {
            ["percentRemainingHealth"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.number-scale-type.choices.percent-remaining-health"),
            ["percentMaxHealth"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.number-scale-type.choices.percent-max-health"),
            ["none"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.number-scale-type.choices.none"),
        },
    });

    game.settings.register("pf2e-rpg-numbers", "damage-split", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.damage-split.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.damage-split.hint"),
        scope: "world",
        config: true,
        default: "by-damage-type",
        type: String,
        choices: {
            ["none"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.damage-split.choices.none"),
            ["by-damage-type"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.damage-split.choices.by-damage-type"),
            ["all"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.damage-split.choices.all"),
        },
    });
    game.settings.register("pf2e-rpg-numbers", "duration", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.duration.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.duration.hint"),
        scope: "world",
        config: true,
        default: 2,
        range: {
            min: 0,
            max: 10,
            step: 0.1
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "wait-time-between-numbers", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.wait-time-between-numbers.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.wait-time-between-numbers.hint"),
        scope: "world",
        config: true,
        default: 100,
        range: {
            min: 0,
            max: 1000,
            step: 1
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "show-only-GM", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.show-only-GM.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.show-only-GM.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register("pf2e-rpg-numbers", "animation-scale", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.animation-scale.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.animation-scale.hint"),
        scope: "world",
        config: true,
        default: 1,
        range: {
            min: 0,
            max: 2,
            step: 0.05
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "jitter", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.jitter.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.dmg-numbers.jitter.hint"),
        scope: "world",
        config: true,
        default: 0,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        type: Number,
    });


    game.settings.register("pf2e-rpg-numbers", "check-enabled", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.enabled.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
    game.settings.register("pf2e-rpg-numbers", "check-color-scheme", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.color-scheme.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.color-scheme.hint"),
        scope: "world",
        config: true,
        default: "default",
        type: String,
        choices: {
            ["default"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.color-scheme.choices.default"),
            ["dark"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.color-scheme.choices.dark"),
        },
    });
    game.settings.register("pf2e-rpg-numbers", "check-outcome-result", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.outcome-result.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.outcome-result.hint"),
        scope: "world",
        config: true,
        default: "outcome-except-combat-crits",
        type: String,
        choices: {
            ["numbers"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.outcome-result.choices.numbers"),
            ["outcome-except-combat-crits"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.outcome-result.choices.outcome-except-combat-crits"),
            ["outcome"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.outcome-result.choices.outcome"),
        },
    });
    game.settings.register("pf2e-rpg-numbers", "check-font-size", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.font-size.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.font-size.hint"),
        scope: "world",
        config: true,
        default: 30,
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "check-duration", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.duration.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.check-animations.duration.hint"),
        scope: "world",
        config: true,
        default: 2,
        range: {
            min: 0,
            max: 10,
            step: 0.1
        },
        type: Number,
    });


    game.settings.register("pf2e-rpg-numbers", "shake-enabled", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.enabled.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register("pf2e-rpg-numbers", "shake-duration", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.duration.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.duration.hint"),
        scope: "world",
        config: true,
        default: 250,
        range: {
            min: 0,
            max: 2000,
            step: 10
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "shake-intensity-max", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-max.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-max.hint"),
        scope: "world",
        config: true,
        default: 35,
        range: {
            min: 1,
            max: 100,
            step: 1
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "shake-intensity-type", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-type.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-type.hint"),
        scope: "world",
        config: true,
        default: "%-current-hp",
        type: String,
        choices: {
            ["max"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-type.choices.max"),
            ["%-current-hp"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-type.choices.%-current-hp"),
            ["%-max-hp"]: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-type.choices.%-max-hp"),
        },
    });
    game.settings.register("pf2e-rpg-numbers", "shake-intensity-include-temp-hp", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-include-temp-hp.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.intensity-include-temp-hp.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
    game.settings.register("pf2e-rpg-numbers", "shake-gm-enabled", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.gm-enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.gm-enabled.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register("pf2e-rpg-numbers", "dmg-shake-directional-enabled", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.token-dmg-shake.enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.token-dmg-shake.enabled.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
    game.settings.register("pf2e-rpg-numbers", "tok-shake-distance", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.distance.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.distance.hint"),
        scope: "world",
        config: true,
        default: 20,
        range: {
            min: 1,
            max: 100,
            step: 1
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "tok-shake-shakes", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.shakes.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.shakes.hint"),
        scope: "world",
        config: true,
        default: 7,
        range: {
            min: 1,
            max: 20,
            step: 1
        },
        type: Number,
    });
    game.settings.register("pf2e-rpg-numbers", "tok-shakes-duration", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.duration.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.screen-shake.duration.hint"),
        scope: "world",
        config: true,
        default: 500,
        range: {
            min: 0,
            max: 2000,
            step: 10
        },
        type: Number,
    });

    game.settings.register("pf2e-rpg-numbers", "rotate-on-attack", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.rotate-on-attack.enabled.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.rotate-on-attack.enabled.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: debouncedReload
    });

    game.settings.register("pf2e-rpg-numbers", "debug-mode", {
        name: game.i18n.localize("pf2e-rpg-numbers.module-settings.debug-mode.name"),
        hint: game.i18n.localize("pf2e-rpg-numbers.module-settings.debug-mode.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });
    game.settings.register("pf2e-rpg-numbers", "updateMessage", {
        scope: "world",
        config: false,
        default: true,
        type: Boolean,
    });


    Hooks.on("renderSettingsConfig", renderSettingsConfig);
});

export function renderSettingsConfig(_, html) {
    const tab = html.find(`.tab[data-tab=${MODULE_ID}]`);

    function beforeGroup(name, key, dom = "h3") {
        const localized = game.i18n.localize(`pf2e-rpg-numbers.module-settings.headers.${key}`);
        tab
            .find(`[name="${MODULE_ID}.${name}"]`)
            .closest(".form-group")
            .before(`<${dom}>${localized}</${dom}>`);
    }

    beforeGroup("dmg-numbers", "dmg-enabled");
    beforeGroup("check-animations", "check-enabled");
    beforeGroup("screen-shake", "shake-enabled");
    beforeGroup("token-dmg-shake", "dmg-shake-directional-enabled");
    beforeGroup("rotate-on-attack", "rotate-on-attack");

    beforeGroup("debug", "debug-mode");
}