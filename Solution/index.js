const fs = require("fs");

let photoCount = 0;
let isFirstLine = true;
let photos = [];
const slideshow = [];

const byTagCounts = {};

readPhotosFile();
// console.log(photos);
// photos = removeVerticalPhotos(photos);
// photos = mergeVerticalPhotos(photos);
// console.log(photos);
sortByTagCount(photos);

for (let i = 0; i < photos.length - 1; i++) {
  console.log("HERE WE GO " + i);
  const photo1 = photos[i];
  const photo2 = photos[i + 1];

  const commonTagCount = getCommonTagCount(
    photo1.slice(2, photo1.length - 1),
    photo2.slice(2, photo2.length - 1)
  );
  const inverseTagCounts = getInverseTagCounts(
    photo1.slice(2, photo1.length - 1),
    photo2.slice(2, photo2.length - 1)
  );

  //   console.log(photo1, photo2, commonTagCount, inverseTagCounts);

  //   console.log(photo1, photo2);
  const roughScore = getRoughScore(photo1[1], photo2[1]);

  const p1i = photo1[photo1.length - 1];
  const p2i = photo2[photo2.length - 1];

  if (roughScore => commonTagCount) {
    if (!slideshow.includes(p1i)) slideshow.push(p1i);
    if (!slideshow.includes(p2i)) slideshow.push(p2i);
  }
  if (inverseTagCounts[0] <= roughScore || inverseTagCounts[1] <= roughScore) {
    if (!slideshow.includes(p1i)) slideshow.push(p1i);
    if (!slideshow.includes(p2i)) slideshow.push(p2i);
  }
}

// for (let i = 0; i < photos.length; i++) {
//   for (let j = 0; j < i; j++) {
//     const photo1 = photos[i];
//     const photo2 = photos[j];

//     const commonTagCount = getCommonTagCount(
//       photo1.slice(2, photo1.length - 1),
//       photo2.slice(2, photo2.length - 1)
//     );
//     const inverseTagCounts = getInverseTagCounts(
//       photo1.slice(2, photo1.length - 1),
//       photo2.slice(2, photo2.length - 1)
//     );
//     const roughScore = getRoughScore(photo1[1], photo2[1]);
//     // console.log(photo1, photo2, commonTagCount, inverseTagCounts);
//     const p1i = photo1[photo1.length - 1];
//     const p2i = photo2[photo2.length - 1];

//     if (roughScore === commonTagCount) {
//       if (!slideshow.includes(p1i)) slideshow.push(p1i);
//       if (!slideshow.includes(p2i)) slideshow.push(p2i);
//     } else if (
//       inverseTagCounts[0] === roughScore ||
//       inverseTagCounts[1] === roughScore
//     ) {
//       if (!slideshow.includes(p1i)) slideshow.push(p1i);
//       if (!slideshow.includes(p2i)) slideshow.push(p2i);
//     }
//   }
// }

writeSlideshowFile(slideshow);

// const tagCount = photos[1];
// byTagCounts[tagCount];
// getCommonTagCount(["abc", "def"], ["abc", "xyz", "def"]);

// console.log(photoCount, photos, slideshow);

function getRoughScore(p1TagCount, p2TagCount) {
  let min = Math.min(p1TagCount, p2TagCount);

  if (min % 2) min--;

  return min / 2;
}

function getCommonTagCount(tagList1, tagList2) {
  const commonTags = [];

  tagList1.forEach(tag1 => {
    const isCommon = tagList2.find(tag2 => tag1 === tag2);
    if (isCommon) commonTags.push(tag1);
  });

  return commonTags.length;
}

function getInverseTagCounts(tagList1, tagList2) {
  const commonTagsCount = getCommonTagCount(tagList1, tagList2);

  return [tagList1.length - commonTagsCount, tagList2.length - commonTagsCount];
}

function mergeVerticalPhotos(photos) {
  const photosNew = [];
  photos.sort((p1, p2) => {
    if (p1[0] === p2[0]) return +1;
    else return -1;
  });
  for (let i = 0; i < photos.length - 1; i++) {
    const photo1 = photos[i];
    const photo2 = photos[i + 1];

    if (photo1[0] === "V" && photo2[0] === "V") {
      photosNew.push(verticalToHorizontal(photo1, photo2));
    }

    if (photo1[0] === "H") {
      photosNew.push(photo1);
    }

    if (photo2[0] === "H") {
      photosNew.push(photo2);
    }
  }

  return photosNew;
}

function removeVerticalPhotos(photos) {
  return photos.filter(item => item[0] !== "V");
}

function verticalToHorizontal(photo1, photo2) {
  const commonTags = new Set([
    ...photo1.slice(2, photo1.length - 1),
    ...photo2.slice(2, photo2.length - 1)
  ]);
  const photo = [
    "H",
    commonTags.size.toString(),
    ...commonTags,
    `${photo1[photo1.length - 1]} ${photo2[photo1.length - 1]}`
  ];
  return photo;
}

// Sort photos by tag count
function sortByTagCount(photos) {
  photos.sort(function(item1, item2) {
    const item1Size = item1[1];
    const item2Size = item2[1];

    return item1Size - item2Size;
  });
}

// Read file input
function readPhotosFile() {
  const array = fs
    .readFileSync("photos.txt")
    .toString()
    .split("\n");
  for (i in array) {
    if (isFirstLine) {
      photoCount = array[i];
      isFirstLine = false;
    } else {
      const photo = array[i].split(" ");
      const index = i - 1;
      photos.push([...photo, index]);
    }
  }
}

function writeSlideshowFile(slides) {
  //   const line1 = slides.length;
  //   const output = [line1, ...slides].join("\n");
  //   try {
  //     fs.writeFileSync("slideshow.txt", output);
  //   } catch (err) {
  //     console.error(err);
  //   }
  const output = [slides.length / 2];

  for (let i = 0; i < slides.length / 2; i = i + 2) {
    output.push(`${slides[i]} ${slides[i + 2]}`);
  }
  try {
    fs.writeFileSync("slideshow.txt", output.join("\n"));
  } catch (err) {
    console.error(err);
  }
}
