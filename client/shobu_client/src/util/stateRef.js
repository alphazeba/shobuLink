import React, { useEffect, useState, useRef } from 'react';

export const useStateRef = (initialValue) => {
    const [state, setState] = useState(initialValue)
    const stateRef = useRef(state)
    useEffect(
      () => { stateRef.current = state },
      [state]
    )
    return [state, stateRef, setState]
  }