
# clamav-yara-scanner

This is a Node.js-based file scanner that integrates ClamAV and YARA to detect malicious files using ClamAV's virus detection engine and YARA's custom rule-based scanning.

## Features
- Supports single file and multiple file uploads.
- Scans files for malware using ClamAV and YARA.
- Provides detailed results of file scanning, including whether the file is clean or malicious.

## Requirements

Before running the project, ensure that you have the following installed on your system:
- [Yara](https://github.com/VirusTotal/yara) for rule-based scanning.
- [ClamAV](https://www.clamav.net/) for virus scanning.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/ilhamdsofyan/clamav-yara-scanner.git
   cd clamav-yara-scanner
   ```

2. Install project dependencies:
   ```
   npm install
   ```

## Usage

### API Endpoints

#### 1. Scan a single file
Endpoint: `POST /scan`
- Upload a single file to be scanned.
- The request should include the file to be scanned and the file extensions to allow (jpeg, jpg, png, pdf, etc).

#### 2. Scan multiple files
Endpoint: `POST /scans`
- Upload multiple files to be scanned.
- The request should include the files to be scanned and the file extensions to allow (jpeg, jpg, png, pdf, etc).

### Example Request (Single File)
```
POST /scan
Content-Type: multipart/form-data
Body: file=<your-file>
```

### Example Request (Multiple Files)
```
POST /scans
Content-Type: multipart/form-data
Body: files=<file1>, <file2>, ...
```

## License

This project is licensed under the MIT License.

## Acknowledgments
- ClamAV: https://www.clamav.net/
- Yara: https://github.com/VirusTotal/yara
