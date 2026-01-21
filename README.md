# Service Worker Demo for WKWebView

This repository contains web pages for testing Service Worker functionality and memory usage in an iOS webview app.

## Reproduction steps

### Running in the app

To profile the app, do these steps:

1. Open the iOS app (in the `ios` folder) in xcode.
1. Select the top level `SimpleWebViewApp` item in the project explorer.
1. Under "Signing & Capabilities" change the "Team" setting to a valid Apple account.
1. Change the Bundle Identifier from `com.benfred.SimpleWebViewApp` to `com.somethingelse.SimpleWebViewApp`.
1. Click the "Run" button to build and install the app onto a connected device.

Then, to test with the service worker disabled:
1. Close the app if it is open and relaunch it
1. Click the "Launch WebView" Test button
1. If the status of the service worker is shown as "Controlled", turn off the Enable SW toggle and wait for the page to reload.
1. The service worker status should show as "Not Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the selected number of elements (the default is 100)
1. Wait for the element count to reach the selected number
1. Stop recording
1. Observe the memory in the captured profile.

And to test with the service worker enabled:
1. Close the app if it is open and relaunch it
1. Click the "Launch WebView" Test button
1. If the status of the service worker is shown as "Not Controlled", turn on the Enable SW toggle and wait for the page to reload.
1. The service worker status should show as "Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the selected number of elements (the default is 100)
1. Wait for the element count to reach the selected number
1. Stop recording
1. Observe the memory in the captured profile.

### Running in Safari

To profile in Safari, do these steps:

To test with the service worker disabled:
1. Start Safari and navigate to `benfredwells.github.io/sw-demo`
1. If the status of the service worker is shown as "Controlled", turn off the Enable SW toggle and wait for the page to reload, then close and reopen Safari.
1. The service worker status should show as "Not Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the selected number of elements (the default is 100)
1. Wait for the element count to reach the selected number
1. Stop recording
1. Observe the memory in the captured profile.

And to test with the service worker enabled:
1. Start Safari and navigate to `benfredwells.github.io/sw-demo`
1. If the status of the service worker is shown as "Not Controlled", turn on the Enable SW toggle and wait for the page to reload, then close and reopen Safari.
1. The service worker status should show as "Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the selected number of elements (the default is 100)
1. Wait for the element count to reach the selected number
1. Stop recording
1. Observe the memory in the captured profile.

### Our results

We found that running with the service worker enabled uses significantly more memory compared to not using it. This difference was less pronounced on a low tier device, but still a significant increase in both the WebView app and Safari. 

#### Results on an iPhone Air

| Env | Test case | Peak physical memory footprint | Peak private resident memory |
| :--- | :--- | ---: | ---: |
| App | No SW | 580MiB | 190MiB |
| App | SW | 1.26GiB (+117%) | 300MiB (+58%) |
| Safari | No SW | 804MiB | 163MiB |
| Safari | SW | 1.13GiB  (+40%)| 370MiB (+126%) |

#### Results on an iPhone SE

| Env | Test case | Peak physical memory footprint | Peak private resident memory |
| :--- | :--- | ---: | ---: |
| App | No SW | 622MiB | 142MiB |
| App | SW | 723MiB (+16%) |  169MiB (+19%) |
| Safari | No SW | 496MiB | 141MiB |
| Safari | SW | 673MiB (+35%) | 235MiB (+67%) |

### Memory Profiling Setup

1. **Prepare Your Device**
   - **⚠️ IMPORTANT: Force quit all other apps** on your iOS device
     - Double-click home button (or swipe up from bottom on newer devices)
     - Swipe up on all apps to close them
   - **⚠️ Ensure Safari is NOT running** - 
   - Close any other apps
   - This ensures you're measuring only your app's WebContent process with minimal interference

2. **Launch Xcode Instruments**
   - Open Xcode
   - Go to `Xcode` → `Open Developer Tool` → `Instruments`
   - Or use keyboard shortcut: `Cmd + I`

3. **Configure Instruments**
   - Select the "Activity Monitor" template
   - Choose your physical iOS device (Simulator may not show accurate WebKit process memory)
   - Click the record button (or `Cmd + R`)

4. **Run the Test**
   - Launch your iOS app on the device
   - Tap the "Launch WebView Test" button
   - A new `WebKit.WebContent` process will appear in Instruments
   - This is the web content process for your WebView

5. **Stop recording and explore results**
   - Click the stop button to stop recording
   - Memory usage can be seen in the process list at the bottom (can be filtered using the Input Filter at the bottom of the page)
   - The Activity Monitor can also be shown just for the one process using the filter button at the top of the page (on the right of "All Tracks")

## GitHub Pages Setup

This app uses a web site hosted on github pages. To use a different github pages account:

1. Push these files to your GitHub repository
2. Go to repository Settings → Pages
3. Under "Source", select the branch (usually `main` or `master`)
4. Select "/ (root)" as the folder
5. Click Save
6. Your site will be available at `https://yourusername.github.io/sw-demo/`

### iOS App Configuration

After publishing to GitHub Pages, update these files in your iOS app:

#### Info.plist
Replace `benfredwells.github.io` with your actual GitHub username:
```xml
<key>WKAppBoundDomains</key>
<array>
    <string>yourusername.github.io</string>
</array>
```

#### ViewController.swift
Replace the URL in `loadRemoteURL()` method:
```swift
let urlString = "https://yourusername.github.io/sw-demo/"
```