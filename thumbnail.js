const fs = require("fs"); // Or `import fs from "fs";` with ESM
const path = require("path");
const AWS = require("aws-sdk");

if (typeof atob === "undefined") {
	global.atob = function (b64Encoded) {
		return new Buffer(b64Encoded, "base64").toString("binary");
	};
}
function uploadToAWS(base64, filename, media_id,model) {
	var s3Bucket = new AWS.S3({ params: { Bucket: sails.config.AWS.BUCKET } });

	buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
	var params = {
		Key: filename,
		Body: buf,
		ContentEncoding: "base64",
		ContentType: "image/png",
		ACL: "public-read",
	};

	s3Bucket.upload(params, function (err, data) {
		if (err) {
			sails.log.error("Error uploading data: ", params);
		}
		sails.log.debug("Media_id:", media_id);
		sails.models.postmedia.update({ id: media_id })
			.set({ media_thumbnail: data.Location })
			.then((result) => {
				sails.log('RESULT',{ result });
				data.result = result;
			});
		sails.log(`File uploaded successfully. File path: ${data.Location}`);
		// imagePath = data.Location;
		return data.Location;
	});
}
module.exports = {
	generateVideoThumbnail: function (post_id, uri,model="postMedia") {
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
	
	},
	updateVideoThumbnails: function (post_medias) {
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
};



