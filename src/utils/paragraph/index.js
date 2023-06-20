import React from "react";

const AutoParagraph = ({ text, wordsPerParagraph }) => {
  const renderParagraphs = (text, wordsPerParagraph) => {
    const words = text.split(" ");
    const paragraphs = [];
    let currentParagraph = "";

    words.forEach((word, index) => {
      currentParagraph += word + " ";

      if ((index + 1) % wordsPerParagraph === 0) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
    });

    if (currentParagraph !== "") {
      paragraphs.push(currentParagraph.trim());
    }

    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-muted" style={{wordWrap:"break-word", fontSize:"18px"}}>{paragraph}</p>
    ));
  };

  const paragraphs = renderParagraphs(text, wordsPerParagraph);

  return <div>{paragraphs}</div>;
};

export default AutoParagraph;
