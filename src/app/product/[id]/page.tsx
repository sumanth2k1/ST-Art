import React from 'react'


const page = async ({params}: {params:{id:String}}) => {
  const {id} = await params;
  return (
    <div>Product: {id}</div>
  )
}

export default page