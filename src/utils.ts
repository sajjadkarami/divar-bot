export function truncate(text: string, maxLength = 1024): string {
  return text.length > maxLength ? text.substring(0, maxLength) : text;
}

export function extractData(item: any) {
  return {
    id: item.url.split("/")[5],
    description: item.description,
    price: item.offers?.price,
    title: item.web_info?.title,
    productionDate: item?.production_date,
    color: item?.color,
    model: item?.model,
    image: item?.image,
    url: item?.url,
    name: item?.name,
    vehicleTransmission: item?.vehicle_transmission,
  };
}

export function buildCaption(post: any) {
  let caption = `<b>${post.title}</b>`;
  if (post.price) caption = caption + `<b>قیمت:</b> ${post.price} تومان\n`;
  if (post.productionDate)
    caption = caption + `<b>تاریخ تولید:</b> ${post.productionDate}\n`;
  if (post.color) caption = caption + `<b>رنگ:</b> ${post.color}\n`;
  if (post.model) caption = caption + `<b>مدل:</b> ${post.model}\n`;
  if (post.vehicleTransmission)
    caption = caption + `<b>نوع گیربکس:</b> ${post.vehicleTransmission}\n`;
  if (post.description)
    caption = caption + `<b>توضیحات:</b> ${post.description}\n`;
  if (post.name) caption += `<b>نام:</b> ${post.name}\n`;
  if (post.url) caption += `<a href="${post.url}">لینک</a>`;
  return caption;
}
