const fs = require("fs"); // Or `import fs from "fs";` with ESM
const path = require("path");

if (typeof atob === "undefined") {
	global.atob = function (b64Encoded) {
		return new Buffer(b64Encoded, "base64").toString("binary");
	};
}

/**
 * @example
 * cosnt thumbnail = new Thumbnail();
 */
class Thumbnail{
	/**
	 * 
	 */
	constructor(){

	}

	/**
	 * 
	 * @param {integer} post_id 
	 * @param {*} uri 
	 * @param {*} model 
	 */
	generateVideoThumbnail(post_id, uri,model="postMedia") {
		sails.log("helper generate thumbnail started",uri);
		try {
			let filename = "tn-" + path.parse(path.basename(uri)).name;

			sails.log.debug("filename:", filename)

			const { dirname } = require("path");
			let appDir = dirname(require.main.filename);
			my_path = `${appDir}/assets/images/thumbnails`;

			sails.log({ pathExist: fs.existsSync(my_path), appDir });
			const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
			const ffmpeg = require("fluent-ffmpeg");
			ffmpeg.setFfmpegPath(ffmpegPath);

			ffmpeg(uri)
				.on("end", function (data) {
					console.log(`Screenshots taken. data ${data}`);

					var bitmap = fs.readFileSync(my_path + "/" + filename + ".png");
					// convert binary data to base64 encoded string
					base64 = new Buffer(bitmap).toString("base64");
					tn_url = uploadToAWS(base64, filename + ".png", post_id,model);
					//base64_encode(path+"/"+filename+".png")
					return true
				})
				.on("error", function (err) {
					console.error({ errIntakingScreenshots: err });
				})
				.screenshots({
					// Will take screenshots at 20%, 40%, 60% and 80% of the video
					count: 1,
					filename: filename + ".png",
					folder: my_path,
				});
		} catch (err) {
			sails.log.error(`Error in helper generate-thumbnail. ${err}`);
		}
	
	}


	/**
	 * 
	 * @param {media} post_medias 
	 */
	updateVideoThumbnails(post_medias) {
		try {
			for (media of post_medias) {
				if (media.type.includes('video')) {
				  try {
				 module.exports.generateVideoThumbnail(media.id, media.uri,"PostMedia")
				  } catch (err) {
					sails.log.error(`Error in util/index.js,function thumbnail. ${err}`)
				  }
				}
			  }
		} catch (err) {
			sails.log.error(`Error in util/index.js,function thumbnail. ${err}`)
		}
	}

}





module.exports = Thumbnail;

