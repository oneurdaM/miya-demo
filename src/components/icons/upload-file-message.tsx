import React from 'react'

export const UploadMessage: React.FC<React.SVGAttributes<{}>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        opacity="0.5"
        d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export const SendMessageGhostIcon: React.FC<React.SVGAttributes<{}>> = (
  props
) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      opacity={0.2}
      d="M17.474 3.295l-4.548 15a.625.625 0 01-1.165.098l-3.169-6.69a.625.625 0 00-.296-.296l-6.69-3.169a.625.625 0 01.098-1.165l15-4.549a.625.625 0 01.77.771z"
      fill="currentColor"
    />
    <path
      d="M17.76 2.24a1.25 1.25 0 00-1.223-.318h-.012L1.53 6.472a1.25 1.25 0 00-.19 2.331l6.69 3.168 3.168 6.69a1.24 1.24 0 001.234.71 1.24 1.24 0 001.094-.9l4.547-14.995v-.012a1.25 1.25 0 00-.313-1.223zm-5.429 15.873l-.004.011-3.075-6.491 3.69-3.692a.625.625 0 00-.883-.883l-3.691 3.69-6.492-3.075h.01l14.99-4.548-4.545 14.988z"
      fill="currentColor"
    />
  </svg>
)
