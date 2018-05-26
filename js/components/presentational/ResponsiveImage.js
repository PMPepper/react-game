import React from 'react';
import PropTypes from 'prop-types';



export default function ResponsiveImage({images, pixelRatio: desiredPixelRatio, outerWidth, outerHeight, innerWidth, innerHeight, ...rest}) {
  if(!images || images.length === 0) {
    return null;
  }

  let selectedImage = null;
  let smallestImage = images[0];

  images.forEach(image => {
    //smallest image (with best pixel ratio fit)
    if(image.width < smallestImage.width || (image.width === smallestImage.width && isBetterPixelRatioFit(desiredPixelRatio, smallestImage.pixelRatio, image.pixelRatio))) {
      smallestImage = image;
    }

    if(image.width < outerWidth) {//is a potential fit
      //select largest image (prefer better matching pixel raio)
      if(!selectedImage || image.width > selectedImage.width || (image.width === selectedImage.width && isBetterPixelRatioFit(desiredPixelRatio, selectedImage.pixelRatio, image.pixelRatio))) {//and is bigger than the current selected
        selectedImage = image;
      }
    }
  });

  return <img src={selectedImage ? selectedImage.url : smallestImage.url} {...rest} />;
}

ResponsiveImage.propTypes = {
  images: PropTypes.array//TODO
};

//Returns true if ratioB is better than ratioA
function isBetterPixelRatioFit(target, ratioA, ratioB) {
  if(ratioA === target) {
    return false;
  }

  if(ratioB === target) {
    return true
  }

  if(ratioA > target && ratioB > target) {//if they are both above the target
    return ratioA > ratioB;//pick the smaller one
  }

  if(ratioA < target && ratioB < target) {//if they are both below the target
    return ratioA < ratioB;//pick the larger one
  }

  //one above and one below, pick the one that is above (the larger one)
  return ratioB > ratioA;
}
