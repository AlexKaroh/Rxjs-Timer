import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number | null): string {
    const hours = Math.floor(value as number / 3600);
    const minutes = Math.floor((value as number % 3600) / 60);
    const seconds = value as number % 60;

    return `${setFormat(hours)}:${setFormat(minutes)}:${setFormat(seconds)}`;
  }
}

function setFormat(value: number): string {
  if (value.toString().length === 1) {
    return "0" + value;
  } else {
    return value.toString();
  }
}
