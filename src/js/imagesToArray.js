export default function imagesToArray(e){

  if(!e){
    console.log('no e');
    return
  }

  let imagesArray = [];
  for(let i=0; i < e.target.files.length; i++){
    let file = e.target.files[i];
    let url = URL.createObjectURL(file);
    let fileName = e.target.files[i].name;
    let reader = new FileReader();

    let imageObject = {file: file,
                       url: url,
                       fileName: fileName,
                      }
    imagesArray.push(imageObject)
    reader.readAsDataURL(file);
  }
  return imagesArray
}
