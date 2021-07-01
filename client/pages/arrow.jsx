import React from 'react';

const Arrow = ({ sideBarState }) => {
  setArrowClass.changeVals();
  return (sideBarState === 'open' ? <i className={`fa fa-arrow-left ${setArrowClass.returnVals()}`}></i> : <i className="fa fa-arrow-left"></i>);
};

const setArrow = function () {
  let arrowClassName = 'visible';
  let executed = false;
  function createVals(className, runState) {
    if (!executed) {
      arrowClassName = 'hidden';
      executed = true;
    }
  }

  return {
    changeVals: function () {
      createVals(arrowClassName, executed);
    },
    returnVals: function () {
      createVals(arrowClassName, executed);
      return arrowClassName;
    }
  };
};

const setArrowClass = setArrow();

export default Arrow;
