import dayjs from "dayjs"

export const formatToRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export const formatTime = (date: Date) => {
  return dayjs(new Date(date)).format("HH:mm")
}
