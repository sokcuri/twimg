// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const e=(()=>{if("top"in self&&self!==top)try{top.location}catch{return!1}else{if("chooseFileSystemEntries"in self)return"chooseFileSystemEntries";if("showOpenFilePicker"in self)return"showOpenFilePicker"}return!1})();
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
e?"chooseFileSystemEntries"===e?import("./file-open.c1794569.js"):import("./file-open.05d00c00.js"):import("./file-open.b0daf53d.js"),
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
e?"chooseFileSystemEntries"===e?import("./directory-open.a2232454.js"):import("./directory-open.2b782ba5.js"):import("./directory-open.917efd07.js");
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const i=e?"chooseFileSystemEntries"===e?import("./file-save.f4966a97.js"):import("./file-save.fb4972a3.js"):import("./file-save.72f7afaf.js");async function o(...e){return(await i).default(...e)}export{o as f};
