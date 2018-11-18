// @flow
import React from 'react';
import classNames from 'classnames';

import './ImageView.scss';

type Props = {
  image?: any,
  className?: string
};

const ImageView = (props: Props) => {
  const { className, image } = props;
  return (
    <div className={classNames('image-view-container', className)}>
      {image ? (
        <>
          <img src={image.url} alt={image.title} />

          <div className={'image-info-box'}>
            <div className="image-info">{image.title}</div>
            <div className="image-info">
              <a href={image.url} target={'_blank'}>
                {image.url}
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className={'default-placeholder-message'}>Loading..</div>
      )}
    </div>
  );
};

export default ImageView;
