function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });
}

function AdminPhotoField({ label, value, onChange }) {
  const isUploadedImage = typeof value === 'string' && value.startsWith('data:');

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert('Please choose an image under 2MB.');
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch (error) {
      window.alert('Unable to upload this image. Please try another file.');
    } finally {
      event.target.value = '';
    }
  }

  return (
    <div className="admin-field admin-field-wide admin-photo-field">
      <span>{label}</span>

      {value ? (
        <div className="admin-photo-preview">
          <img src={value} alt="" />
          <button className="admin-secondary-button" type="button" onClick={() => onChange('')}>
            Remove photo
          </button>
        </div>
      ) : null}

      <label className="admin-field">
        Online photo URL
        <input
          type="url"
          value={isUploadedImage ? '' : value ?? ''}
          placeholder="https://example.com/photo.jpg"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>

      <label className="admin-upload-button">
        Upload photo
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </label>

      <small>Use an online URL or upload a JPG, PNG, or WebP image up to 2MB.</small>
      {isUploadedImage ? <small>This photo is saved locally in your browser.</small> : null}
    </div>
  );
}

export default AdminPhotoField;
