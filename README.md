# Service Worker Demo for WKWebView

This repository contains web pages for testing Service Worker functionality and memory usage in an iOS webview app.

Note - the raw results of all experiments are in `results.txt`, and the profile traces are in the `traces` folder.

## Preparing the app

To run the app in the profiler, first do these steps:

1. Open the iOS app (in the `ios` folder) in xcode.
1. Select the top level `SimpleWebViewApp` item in the project explorer.
1. Under "Signing & Capabilities" change the "Team" setting to a valid Apple account.
1. Change the Bundle Identifier from `com.benfred.SimpleWebViewApp` to `com.somethingelse.SimpleWebViewApp`.
1. Click the "Run" button to build and install the app onto a connected device.

## Crash reproduction steps

### Running in the app

Then, to test with the service worker disabled:
1. Close the app if it is open and relaunch it
1. Click the "Launch WebView" Test button
1. If the status of the service worker is shown as "Controlled", turn off the Enable SW toggle and wait for the page to reload.
1. The service worker status should show as "Not Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add 100 elements
1. Wait for the element count to reach the selected number
1. Repeat the last two steps another 29 times (30 total) to add 3000 element.
1. Stop recording
1. Observe the memory in the captured profile.

And to test with the service worker enabled:
1. Close the app if it is open and relaunch it
1. Click the "Launch WebView" Test button
1. If the status of the service worker is shown as "Not Controlled", turn on the Enable SW toggle and wait for the page to reload.
1. The service worker status should show as "Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add 100 elements
1. Wait for the element count to reach the selected number
1. Repeat the last two steps another 29 times (30 total) to add 3000 element.
1. Stop recording
1. Observe the memory in the captured profile.

### Running in Safari

To profile in Safari, do these steps:

To test with the service worker disabled:
1. Start Safari and navigate to `benfredwells.github.io/sw-demo`
1. If the status of the service worker is shown as "Controlled", turn off the Enable SW toggle and wait for the page to reload, then close and reopen Safari.
1. The service worker status should show as "Not Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add 100 elements
1. Wait for the element count to reach the selected number
1. Repeat the last two steps another 29 times (30 total) to add 3000 element.
1. Stop recording
1. Observe the memory in the captured profile.

And to test with the service worker enabled:
1. Start Safari and navigate to `benfredwells.github.io/sw-demo`
1. If the status of the service worker is shown as "Not Controlled", turn on the Enable SW toggle and wait for the page to reload, then close and reopen Safari.
1. The service worker status should show as "Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add 100 elements
1. Wait for the element count to reach the selected number
1. Repeat the last two steps another 29 times (30 total) to add 3000 element.
1. Stop recording
1. Observe the memory in the captured profile.

### Our results

We ran the above test 3 times. The average number of crashes where:

| Env | Test case | Crashes on iPhone Air | Crashes on iPhone SE |
| :--- | :--- | ---: | ---: |
| App | No SW | 2 | 1 |
| App | SW | 3 (**+50%**) | 3.33 (**+233%**) |
| Safari | No SW | 2 | 1.33 |
| Safari | SW | 3 (**+50%**)| 3 (**+125%**) |

**Note there was an interesting pattern observed with the crashes when service worker was enabled.** The odd numbered incarnations of the webview (e.g. the first and third) lasted much shorter than the even numbered incarnations (the second and fourth). The even numbered seemed to live a comparable time to the non-service worker versions while the odd were much shorter.

## Memory use reproduction steps

### Running in the app

To test with the service worker disabled:
1. Close the app if it is open and relaunch it
1. Click the "Launch WebView" Test button
1. If the status of the service worker is shown as "Controlled", turn off the Enable SW toggle and wait for the page to reload.
1. The service worker status should show as "Not Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the 100 elements
1. Wait for the element count to reach the 100
1. Stop recording
1. Observe the memory in the captured profile.

And to test with the service worker enabled:
1. Close the app if it is open and relaunch it
1. Click the "Launch WebView" Test button
1. If the status of the service worker is shown as "Not Controlled", turn on the Enable SW toggle and wait for the page to reload.
1. The service worker status should show as "Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the 100 elements
1. Wait for the element count to reach the 100
1. Stop recording
1. Observe the memory in the captured profile.

### Running in Safari

To profile in Safari, do these steps:

To test with the service worker disabled:
1. Start Safari and navigate to `benfredwells.github.io/sw-demo`
1. If the status of the service worker is shown as "Controlled", turn off the Enable SW toggle and wait for the page to reload, then close and reopen Safari.
1. The service worker status should show as "Not Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the 100 elements
1. Wait for the element count to reach the 100
1. Stop recording
1. Observe the memory in the captured profile.

And to test with the service worker enabled:
1. Start Safari and navigate to `benfredwells.github.io/sw-demo`
1. If the status of the service worker is shown as "Not Controlled", turn on the Enable SW toggle and wait for the page to reload, then close and reopen Safari.
1. The service worker status should show as "Controlled".
1. Start recording in the profiler (see below for setup details)
1. Click the "Add them!" button to add the 100 elements
1. Wait for the element count to reach the 100
1. Stop recording
1. Observe the memory in the captured profile.

### Our results

We ran the profiler 5 times for each of the below scenarios and averaged the results. There is a clear and significant increase in physical memory footprint when the service worker is enabled.

#### Results on an iPhone Air

| Env | Test case | Peak physical memory footprint |
| :--- | :--- | ---: |
| App | No SW | 707MiB |
| App | SW | 1.04GiB (**+51%**) |
| Safari | No SW | 754MiB |
| Safari | SW | 944MiB  (**+25%**)|

#### Results on an iPhone SE

| Env | Test case | Peak physical memory footprint |
| :--- | :--- | ---: |
| App | No SW | 504MiB |
| App | SW | 728MiB (**+44%**) |
| Safari | No SW | 424MiB |
| Safari | SW | 772MiB (**+82%**) |

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