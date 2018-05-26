import React from 'react';
import {getDisplayName} from 'recompose';



export default function DragAndDropFileLoadComponent({
  dropEffect = 'copy'
} = {}) {
  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = dropEffect;
  }

  function handleDrop(e, onFileLoadStart, onFileLoadProgress, onFileLoaded, onFileLoadAbort, onFileLoadError, onFileLoadEnd) {
    e.stopPropagation();
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      const reader = new FileReader;

      reader.onloadstart = onFileLoadStart ? (loadStartEvent) => {
        onFileLoadStart(file, loadStartEvent);
      } : null;

      reader.onprogress = onFileLoadProgress ? (progressEvent) => {
        onFileLoadProgress(progressEvent.loaded / progressEvent.total, file, progressEvent);
      } : null;

      reader.onload = onFileLoaded ? (loadEvent) => {
        onFileLoaded(loadEvent.target.result, file, loadEvent);
      } : null;

      reader.onabort = onFileLoadAbort ? (abortEvent) => {
        onFileLoadAbort(file, abortEvent);
      } : null;

      reader.onerror = onFileLoadError ? (errorEvent) => {
        onFileLoadError(file, errorEvent);
      } : null;

      reader.onloadend = onFileLoadEnd ? (loadEndEvent) => {
        onFileLoadEnd(file, loadEndEvent);
      } : null;

      reader.readAsText(file);
    })
  }

  return (PresentationalComponent) => {
    const Component = ({onFileLoadStart = null, onFileLoadProgress = null, onFileLoaded = null, onFileLoadAbort = null, onFileLoadError = null, onFileLoadEnd = null, ...rest}) => {
      return <div onDragOver={handleDragOver} onDrop={(e) => {handleDrop(e, onFileLoadStart, onFileLoadProgress, onFileLoaded, onFileLoadAbort, onFileLoadError, onFileLoadEnd)}}>
        <PresentationalComponent {...rest} />
      </div>
    };

    Component.displayName = `DragAndDropFileLoadComponent(${getDisplayName(PresentationalComponent)})`;

    return Component;
  };
}
