import React from 'react'
import { useRouteError } from 'react-router-dom';


export default function Error() {
    const err = useRouteError();
    console.log(err)
  return (
    <div>
      <h1>{err.status}</h1>
      <h4>Not Found</h4>
      <p>{err.error.message}</p>
    </div>
  )
}
