try {
  self.importScripts('./bundles/supabase/supa_rtdb_bundle.js');
  console.log('IMPORTED');
} catch (err) {
  console.log(err);
}

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


