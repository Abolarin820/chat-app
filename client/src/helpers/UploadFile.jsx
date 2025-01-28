const url =`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/auto/upload`


const uploadFile = async (file)=>{
    const formData = new FormData();

    formData.append('file', file)
    formData.append('upload_preset','chat-app-file') //upload inside a specific folder

    const response = await fetch(url, {
        method: 'post',
        body: formData 
    })

    const responseData = await response.json();

    return responseData
    console.log(responseData)
}

export default uploadFile