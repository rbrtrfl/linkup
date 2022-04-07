// @ts-nocheck

import React, { useState, useEffect } from 'react';
import './FilterTags.css';

interface myProps {
  filterByTag: any
}

function FilterTags({ filterByTag }: myProps) {
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL || '/api';

  useEffect(() => {
    fetch(`${baseUrl}/tags`)
      .then((response) => response.json())
      .then((result) => setTagList(result.data))
      .catch((error) => console.log('error', error));
  }, []);

  useEffect(() => {
    filterByTag(selectedTags);
  }, [selectedTags]);

  const handleClick = (clickedTag) => {
    if (selectedTags.includes(clickedTag)) {
      const prunedTags = selectedTags.filter((tag) => tag !== clickedTag);
      setSelectedTags(prunedTags);
    } else {
      setSelectedTags((currTags) => [...currTags, clickedTag]);
    }
  };

  const renderedTags = tagList.map((tag) => {
    let classNames = 'ft__btn ';
    if (selectedTags.includes(tag.name)) {
      // if id_tag is 10 or greater, get units only as only 10 colors are available
      classNames += `ft__btn-selected color${tag.id_tag}`;
    } else {
      classNames += 'ft__btn-unselected';
    }
    return (
      <div key={tag.id_tag} className="ft__tag-item">
        <button
          type="button"
          className={classNames}
          id={tag.id_tag}
          onClick={() => handleClick(tag.name)}
        >
          {tag.name}

        </button>
        <span className="ft__btn-space" />
      </div>
    );
  });

  return (
    <div className="ft__container">
      {renderedTags}
    </div>
  );
}

export default FilterTags;
