import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { getTrad } from '../../utils';
import CardControl from '../CardControl';
import CardControlWrapper from './CardControlWrapper';
import CardPreviewWrapper from './CardPreviewWrapper';
import EmptyInputMedia from './EmptyInputMedia';
import EmptyText from './EmptyText';
import IconUpload from './IconUpload';
import InputFilePreview from './InputFilePreview';
import InputModalStepper from '../../containers/InputModalStepper';
import Name from './Name';
import Wrapper from './Wrapper';

const InputMedia = ({ label, onChange, name, attribute, value, type }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    step: null,
  });
  const [fileToDisplay, setFileToDisplay] = useState(0);

  const handleClickToggleModal = () => {
    setModal(prev => ({ isOpen: !prev.isOpen }));
  };
  const hasNoValue = Array.isArray(value) && value.length === 0;

  const handleChange = v => {
    onChange({ target: { name, type, value: v } });
  };

  const handleFilesNavigation = displayNext => {
    if (attribute.multiple) {
      if (displayNext && fileToDisplay === value.length - 1) {
        setFileToDisplay(0);

        return;
      }

      if (!displayNext && fileToDisplay === 0) {
        setFileToDisplay(value.length - 1);
      } else {
        setFileToDisplay(prev => (displayNext ? prev + 1 : prev - 1));
      }
    }
  };

  const handleRemoveFile = () => {
    const newValue = attribute.multiple
      ? value.filter((file, index) => index !== fileToDisplay)
      : null;
    handleChange(newValue);
  };

  const handleEditFile = () => {
    setModal(() => ({ isOpen: true, step: 'edit' }));
  };

  const displaySlidePagination =
    attribute.multiple && value.length > 1 ? ` (${fileToDisplay + 1}/${value.length})` : '';

  return (
    <Wrapper>
      <Name htmlFor={name}>{`${label}${displaySlidePagination}`}</Name>

      <CardPreviewWrapper>
        <CardControlWrapper>
          <CardControl color="#9EA7B8" type="plus" onClick={handleClickToggleModal} />
          {!hasNoValue && (
            <>
              <CardControl color="#9EA7B8" type="pencil" onClick={handleEditFile} />
              <CardControl color="#9EA7B8" type="link" onClick={handleClickToggleModal} />
              <CardControl color="#9EA7B8" type="trash-alt" onClick={handleRemoveFile} />
            </>
          )}
        </CardControlWrapper>
        {hasNoValue ? (
          <EmptyInputMedia onClick={handleClickToggleModal}>
            <IconUpload />
            <EmptyText id={getTrad('input.placeholder')} />
          </EmptyInputMedia>
        ) : (
          <InputFilePreview
            isSlider={attribute.multiple && value.length > 1}
            file={attribute.multiple ? value[fileToDisplay] : value}
            onClick={handleFilesNavigation}
          />
        )}
      </CardPreviewWrapper>

      {modal.isOpen && (
        <InputModalStepper
          isOpen={modal.isOpen}
          step={modal.step}
          multiple={attribute.multiple}
          onInputMediaChange={handleChange}
          selectedFiles={value}
          onToggle={handleClickToggleModal}
        />
      )}
    </Wrapper>
  );
};

InputMedia.propTypes = {
  attribute: PropTypes.shape({
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
InputMedia.defaultProps = {
  label: '',
  value: null,
};

export default InputMedia;
