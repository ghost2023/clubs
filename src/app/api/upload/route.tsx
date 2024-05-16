import fs from 'fs/promises';
import { NextRequest } from "next/server";
import { join } from 'path';

// const saveFile = async (file: File, filePath: string) => {
//   const stream = fs.createWriteStream(filePath);
//   stream.on('finish', () => console.log('File saved successfully!'));
//   stream.on('error', (err) => console.error('Error saving file:', err));
//   file.stream().pipeTo(stream);
//   await new Promise((resolve, reject) => stream.on('end', resolve).on('error', reject));
// };

export async function POST(req: NextRequest) {
  const formdata = await req.formData()

  if(!formdata) return Response.json({error: 'No body'},{status: 400})

  const name = formdata.get('name')

  if(!name || typeof name != 'string') return Response.json({error: 'No or bad name'},{status: 400})
  
  const file = formdata.get('file')

  if(!file || typeof file == 'string') return Response.json({error: 'No file'},{status: 400})

  let newName = Date.now() + name

  const handlre = await fs.open(join(__dirname,`../../../../../public/uploads/${newName}`), 'w')
  await handlre.write(Buffer.from(await file.arrayBuffer()))

  // await fs.writeFile(join(__dirname,`../../../../public/uploads/${newName}`), file.stream())

  return Response.json({success:true, newName})

}
