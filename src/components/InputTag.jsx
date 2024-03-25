import { useEffect, useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { getTags } from '../api/tags.api';
import RemoveComponent from './RemoveComponent';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function InputTag({ tags, setTags }) {
  const [suggestions, setSuggestions] = useState([]);

  const getTagList = async () => {
    try {
      const response = await getTags();
      const suggestionsList = response.data.map(tag => {
        return { id: tag._id, text: tag.tagName };
      });
      setSuggestions(suggestionsList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTagList();
  }, []);

  // Method to delete tag from Array
  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  // Method to Add tag into Array
  const handleAddition = tag => {
    setTags([...tags, tag]);
  };
  return (
    <>
      {suggestions && (
        <ReactTags
          tags={tags}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          allowDeleteFromEmptyInput={false}
          inputFieldPosition="top"
          autocomplete
          allowDragDrop={false}
          autofocus={false}
          suggestions={suggestions}
          removeComponent={RemoveComponent}
          classNames={{
            tags: 'flex-col',
            tagInput: 'p-chips p-component p-inputwrapper w-full flex-col  ',
            tagInputField: 'p-inputtext w-full box-border portfolio',
            selected: 'p-chips p-chips-multiple-container p-chips-token pl-0',
            tag: 'p-chips p-chips-multiple-container p-chips-token bg-accent-light px-3 py-1 rounded-full font-medium gap-1 text-black mt-2 mr-1',
            suggestions:
              'pt-3 bg-white shadow-[0_0_0_1px_#FCDAD8] border border-accent-light rounded-b-md -mt-2 -z-10 w-full suggestions',
            activeSuggestion: 'flex bg-accent-light active-suggestions',
          }}
        />
      )}
    </>
  );
}

export default InputTag;
