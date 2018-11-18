import React, { Component } from 'react';
import axios from 'axios';

import ImageView from '../../components/Image/ImageView';
import './LazyImages.scss';
import { API } from '../../config/api';
import { loadImage } from '../../utils/Image';

type Props = {};
type State = {
  images: Array<any>,
  loadedImageCount: Number,
  selectedImage: Object,
  imageRequestThreshold: Number,
  imageInterval: Number,
  imageLoopingId: any,
  imageDownloadInProgress: boolean
};

class LazyImages extends Component<Props, State> {
  state = {
    images: [],
    selectedImage: null,
    loadedImageCount: 0,
    imageRequestThreshold: 10,
    imageLoopingId: null,
    imageInterval: 5000,
    imageDownloadInProgress: false
  };

  componentDidMount(): void {
    this.getImages().then(() => {
      this.startAutomaticImageLoading();
      this.loadImages(1);
    });
  }

  componentWillUnmount(): void {
    this.stopAutomaticImageLoading();
  }

  async loadImages(startRange: Number, endRange: Number) {
    let imageCount = this.state.images.length;

    if (!imageCount || startRange > imageCount) {
      console.warn(
        `Image Count is ${imageCount}, but the given start range is ${startRange}`
      );
      return;
    }

    this.setState({
      imageDownloadInProgress: true
    });
    let imageRequestThreshold = this.state.imageRequestThreshold;
    let imagesToLoad = [];
    /*If the endRange is defined and finite, use end range
    else, download using the predefined image request threshold value
    */
    let end = Number.isFinite(endRange)
      ? endRange
      : startRange + imageRequestThreshold > imageCount
      ? imageCount
      : startRange + imageRequestThreshold;

    for (let i = startRange; i < end; i++) {
      imagesToLoad.push(loadImage(this.state.images[i].url));
    }

    await Promise.all(imagesToLoad)
      .then(response => {
        this.setState({
          loadedImageCount: end,
          imageDownloadInProgress: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          imageDownloadInProgress: false
        });
      });
  }

  async getImages() {
    await axios
      .get(API.GET_IMAGE_LIST)
      .then(response => {
        // console.log(response);
        let data = null;
        if (response && Array.isArray(response.data) && response.data.length) {
          data = response.data;
        }
        this.setState({
          images: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setSelectedImage(image, index) {
    this.setState(
      {
        selectedImage: {
          ...image,
          index
        }
      },
      () => {
        // console.log(this.state.selectedImage.index);
      }
    );
  }

  onImagePlayControlClick() {
    if (Number.isFinite(this.state.imageLoopingId)) {
      this.stopAutomaticImageLoading();
    } else {
      this.startAutomaticImageLoading();
    }
  }

  onNavigateControlClick(direction) {
    if (!direction && this.state.images.length && this.state.selectedImage)
      return;
    let newImageDirection = 1; // NEXT
    if (direction === 'PREVIOUS') {
      newImageDirection = -1;
    }

    let selectedImageIndex = this.state.images
      .slice()
      .findIndex(image => image.id === this.state.selectedImage.id);
    if (selectedImageIndex > -1) {
      this.setSelectedImage(
        this.state.images[selectedImageIndex + newImageDirection],
        selectedImageIndex + newImageDirection
      );
    }
  }

  imageSelection() {
    if (!this.state.selectedImage) {
      this.setSelectedImage(this.state.images[0], 0);
      this.setState({
        loadedImageCount: 1
      });
      return;
    }

    if (this.state.images[this.state.selectedImage.index + 1]) {
      this.setSelectedImage(
        this.state.images[this.state.selectedImage.index + 1],
        this.state.selectedImage.index + 1
      );
      this.checkAndLoadImages(this.state.selectedImage.index + 1);
      return;
    }

    if (Number.isFinite(this.state.imageLoopingId)) {
      this.stopAutomaticImageLoading();
    }
  }

  checkAndLoadImages(selectedImageIndex) {
    if (this.state.loadedImageCount - (selectedImageIndex + 1) < 4) {
      this.loadImages(this.state.loadedImageCount);
    }
  }

  startAutomaticImageLoading() {
    if (!this.state.selectedImage) this.imageSelection();
    let imageLoopingId = window.setInterval(
      this.imageSelection.bind(this),
      this.state.imageInterval
    );
    this.setState({
      imageLoopingId
    });
  }

  stopAutomaticImageLoading() {
    window.clearInterval(this.state.imageLoopingId);
    this.setState({
      imageLoopingId: null
    });
  }

  render() {
    return (
      <div className={'lazy-images-container'}>
        <div className={'request-status-box'}>
          <div className="request-status-message">
            Current Image{' '}
            {this.state.selectedImage
              ? this.state.selectedImage.index + 1
              : 'NA'}
          </div>
          <div className="request-status-message">
            Downloaded Images {this.state.loadedImageCount}
          </div>
          {this.state.imageDownloadInProgress && (
            <div className="request-status-message">
              Requesting new images..
            </div>
          )}
        </div>

        <h1 className="app-title">React - Lazy Image Loader</h1>

        <ImageView
          className={'image-view-custom'}
          image={this.state.selectedImage}
        />

        <div className="image-control-box">
          <button
            className="image-navigation-control"
            title={'Previous Photo'}
            disabled={
              this.state.selectedImage && this.state.selectedImage.index === 0
            }
            onClick={() => this.onNavigateControlClick('PREVIOUS')}
          >
            <i className={'material-icons'}>skip_previous</i>
          </button>
          <button
            className="image-navigation-control control__large"
            title={
              Number.isFinite(this.state.imageLoopingId) ? 'Pause' : 'Play'
            }
            onClick={() => this.onImagePlayControlClick()}
          >
            <i className={'material-icons'}>
              {Number.isFinite(this.state.imageLoopingId)
                ? 'pause'
                : 'play_arrow'}
            </i>
          </button>
          <button
            className="image-navigation-control"
            title={'Next Photo'}
            disabled={
              this.state.selectedImage &&
              this.state.selectedImage.index === this.state.images.length - 1
            }
            onClick={() => this.onNavigateControlClick('NEXT')}
          >
            <i className={'material-icons'}>skip_next</i>
          </button>
        </div>

        <div className={'developer-info-box'}>
          <div className="developer-info">
            Developed by{' '}
            <a
              href="https://mallikcheripally.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mallik Cheripally
            </a>
            &nbsp;&nbsp;&nbsp; •&nbsp;&nbsp;&nbsp;Source code available on{' '}
            <a
              href="https://github.com/mallikcheripally/react-lazy-image-loader"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default LazyImages;
