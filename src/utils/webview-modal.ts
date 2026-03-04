import * as WebBrowser from 'expo-web-browser';
import { WebBrowserPresentationStyle } from 'expo-web-browser';

export async function openWebViewModal(href: string) {
  await WebBrowser.openBrowserAsync(href, {
    dismissButtonStyle: 'close',
    presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
  });
}
