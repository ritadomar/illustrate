import { useEffect, useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { getTags } from '../api/tags.api';

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
      console.log(suggestionsList);
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
    console.log(tag);
    setTags([...tags, tag]);
    console.log(tags);
  };
  return (
    <>
      {suggestions.length > 0 && (
        <ReactTags
          tags={tags}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          inputFieldPosition="top"
          autocomplete
          allowDragDrop={false}
          autofocus={false}
          suggestions={suggestions}
        />
      )}
    </>
  );
}

export default InputTag;
