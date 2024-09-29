import { getSetting } from "../../misc.js";
/**
 *  Conversion method from css clip path
 * r = """0% 55%, 2% 52%, 9% 51%, 15% 44%, 23% 40%, 32% 38%, 34% 36%, 35% 35%, 41% 28%, 43% 30%, 50% 26%, 53% 27%, 58% 26%, 59% 26%, 62% 24%, 65% 25%, 71% 23%, 78% 15%, 85% 14%, 89% 14%, 95% 11%, 97% 12%, 100% 9%, 100% 55%, 97% 53%, 96% 55%, 92% 55%, 80% 56%, 72% 57%, 69% 58%, 64% 63%, 62% 63%, 61% 65%, 59% 63%, 57% 62%, 55% 64%, 53% 65%, 49% 63%, 43% 63%, 39% 64%, 37% 65%, 36% 65%, 34% 68%, 32% 67%, 29% 72%, 27% 71%, 27% 73%, 24% 72%, 22% 73%, 20% 70%, 16% 73%, 14% 71%, 13% 72%, 10% 71%, 5% 72%, 6% 70%, 0% 73%"""

 for pair in r.split(","):
 pair = pair.replace('%', '').strip()
 items = pair.split(" ")
 widthPer = str(int(items[0])/100)
 heightPer = str(int(items[1])/100)
 print("[" + widthPer + "* width, " + heightPer + "* height],")
 */
//https://www.cssportal.com/css-clip-path-generator/
/**
 * Perform a critical hit animation resembling a persona-like effect.
 * This function creates an animated effect centered around the provided token, displaying
 * an image with a polygonal mask, along with other visual effects and sounds.
 *
 * @param {Token} token - The token object around which the animation will be centered.
 * @param {User[]} users - An array of users who will see the animation.
 * @param {Object} imgData - An object containing image data, including image URL and scaling information.
 * @param {string} imgData.img - The URL of the image to be displayed in the animation.
 * @param {number} imgData.scaleX - The horizontal scaling factor of the image.
 * @param {number} imgData.yScale - The vertical scaling factor of the image.
 * @returns {void}
 */

export function personaCrit(token, users, imgData, config) {
    const flags = token.flags?.["pf2e-rpg-numbers"];
    const [personaImg, critScale, critOffsetX, critOffsetY, critRotation] = [
        flags?.personaImg || "",
        flags?.critScale || 100,
        flags?.critOffsetX || 0,
        flags?.critOffsetY || 0,
        flags?.critRotation || 0,
    ];

    const imageUrl = personaImg || imgData.img;
    const isWebm = imageUrl.endsWith(".webm");
    const duration = getSetting("critical.duration") * 1000;
    const soundUrl = config.sfx;
    const volumeLevel = config.volume;

    if (isWebm) {
        const video = document.createElement("video");
        video.src = imageUrl;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        video.onloadeddata = async () => {
            await Sequencer.Preloader.preloadForClients([imageUrl, soundUrl]);
            await new Sequence()
                // Video
                .effect()
                .syncGroup(`p5-crit-${token.uuid}`)
                .file(imageUrl)
                .zIndex(10)
                .screenSpace()
                .screenSpaceScale({ fitY: true, ratioX: true })
                .screenSpaceAboveUI()
                .duration(3000)
                .duration(duration)
                .forUsers(users)
                .delay(config.delay)
                // Sound
                .sound()
                .file(soundUrl)
                .fadeOutAudio(duration / 4)
                .volume(volumeLevel)
                .forUsers(users)
                .delay(config.delay)
                .play();
        };
    } else {
        const image = new Image();
        image.src = imageUrl;

        image.onload = async ({ target }) => {
            await Sequencer.Preloader.preloadForClients([imageUrl, soundUrl]);
            await new Sequence()
                // Video
                .effect()
                .syncGroup(`p5-crit-${token.uuid}`)
                .file(imageUrl)
                .zIndex(10)
                .screenSpace()
                .screenSpaceScale({ fitY: true, ratioX: true })
                .screenSpaceAboveUI()
                .duration(duration)
                .forUsers(users)
                .delay(config.delay)
                // Sound
                .sound()
                .file(soundUrl)
                .fadeOutAudio(duration / 4)
                .volume(volumeLevel)
                .forUsers(users)
                .delay(config.delay)
                .play();
        };
    }
}