import React, { useState } from 'react';

import Toggle from 'shared/ui/toggle';
import Button from 'shared/ui/button';

export default {
  title: 'Styles/Form',
  parameters: {
    // docs: { page: null },
    docs: { source: { type: 'dynamic' } },
    controls: { hideNoControlsWarning: true },
  },
};

export const FormControlWithTextField = () => {
  const [value, setValue] = useState();
  const handleChange = (e) => setValue(e?.target?.value);
  return (
    <div className="flex space-x-6">
      <div className="form-control">
        <label className="form-label" htmlFor="input-id-1-a" id="label-id-1-a">
          Label
        </label>
        <input
          className="form-input"
          id="input-id-1-a"
          type="text"
          placeholder="Text here..."
          aria-invalid="false"
          aria-labelledby="label-id-1-a"
          aria-describedby="helper-text-id-1-a"
          value={value}
          onChange={handleChange}
        />
        <span className="form-helper-text" id="helper-text-id-1-a">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <label className="form-label __error" htmlFor="input-id-2-a" id="label-id-2-a">
          Label
        </label>
        <input
          className="form-input __error"
          id="input-id-2-a"
          type="text"
          placeholder="Text here..."
          aria-invalid="true"
          aria-labelledby="label-id-2-a"
          aria-describedby="helper-text-id-2-a"
          value={value}
          onChange={handleChange}
        />
        <span className="form-helper-text __error" id="helper-text-id-2-a">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <label className="form-label" htmlFor="input-id-3-a" id="label-id-3-a">
          Label
        </label>
        <input
          className="form-input __disabled"
          id="input-id-3-a"
          type="text"
          placeholder="Text here..."
          aria-invalid="false"
          aria-labelledby="label-id-3-a"
          aria-describedby="helper-text-id-3-a"
          aria-disabled="true"
          disabled
          value={value}
          onChange={handleChange}
        />
        <span className="form-helper-text __end" id="helper-text-id-3-a">
          Helper text
        </span>
      </div>
    </div>
  );
};

export const FormControlWithCheckbox = () => {
  const [enabled, setEnabled] = useState(false);
  const handleChange = (e) => setEnabled(Boolean(e?.target?.checked));
  return (
    <div className="flex space-x-12">
      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <label className="form-control-label __end">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-1-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __end">
            <input
              className="form-checkbox __error"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-1-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __end __disabled">
            <input
              className="form-checkbox __disabled"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-disabled="true"
              aria-describedby="helper-text-id-1-b"
              disabled
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-1-b">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <label className="form-control-label __start">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-2-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __start">
            <input
              className="form-checkbox __error"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-2-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __start __disabled">
            <input
              className="form-checkbox __disabled"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-disabled="true"
              aria-describedby="helper-text-id-2-b"
              disabled
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-2-b">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <label className="form-control-label __top">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-3-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __top">
            <input
              className="form-checkbox __error"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-3-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __top __disabled">
            <input
              className="form-checkbox __disabled"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-disabled="true"
              aria-describedby="helper-text-id-3-b"
              disabled
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-3-b">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <label className="form-control-label __bottom">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-4-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __bottom">
            <input
              className="form-checkbox __error"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-describedby="helper-text-id-4-b"
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>

          <label className="form-control-label __bottom __disabled">
            <input
              className="form-checkbox __disabled"
              type="checkbox"
              checked={enabled}
              aria-checked={enabled}
              aria-disabled="true"
              aria-describedby="helper-text-id-4-b"
              disabled
              onChange={handleChange}
            />
            <span className="form-control-label_label">Label</span>
          </label>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-4-b">
          Helper text
        </span>
      </div>
    </div>
  );
};

export const FormControlWithToggle = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex space-x-12">
      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <Toggle.Group as="span" className="form-control-label __end">
            <Toggle className="form-toggle" checked={enabled} aria-describedby="helper-text-id-1-c" onChange={setEnabled} />
            <Toggle.Label as="span" className="form-control-label_label">
              Label
            </Toggle.Label>
          </Toggle.Group>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-1-c">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <Toggle.Group as="span" className="form-control-label __start">
            <Toggle className="form-toggle" checked={enabled} aria-describedby="helper-text-id-2-c" onChange={setEnabled} />
            <Toggle.Label as="span" className="form-control-label_label">
              Label
            </Toggle.Label>
          </Toggle.Group>
        </fieldset>
        <span className="form-helper-text __end" id="helper-text-id-2-c">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <Toggle.Group as="span" className="form-control-label __top">
            <Toggle className="form-toggle" checked={enabled} aria-describedby="helper-text-id-3-c" onChange={setEnabled} />
            <Toggle.Label as="span" className="form-control-label_label">
              Label
            </Toggle.Label>
          </Toggle.Group>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-3-c">
          Helper text
        </span>
      </div>

      <div className="form-control">
        <legend className="form-label">Legend</legend>
        <fieldset className="form-group">
          <Toggle.Group as="span" className="form-control-label __bottom">
            <Toggle className="form-toggle" checked={enabled} aria-describedby="helper-text-id-4-c" onChange={setEnabled} />
            <Toggle.Label as="span" className="form-control-label_label">
              Label
            </Toggle.Label>
          </Toggle.Group>
        </fieldset>
        <span className="form-helper-text" id="helper-text-id-4-c">
          Helper text
        </span>
      </div>
    </div>
  );
};

export const FormControlRowWithTextField = () => {
  const [value, setValue] = useState();
  const handleChange = (e) => setValue(e?.target?.value);
  return (
    <div className="form-control w-full __row">
      <label className="form-label" htmlFor="input-id-1-d" id="label-id-1-d">
        Label
      </label>
      <input
        className="form-input flex-grow"
        id="input-id-1-d"
        type="text"
        placeholder="Text here..."
        aria-invalid="true"
        aria-labelledby="label-id-1-d"
        aria-describedby="helper-text-id-1-d"
        value={value}
        onChange={handleChange}
      />
      <span className="form-helper-text" id="helper-text-id-1-d">
        Helper text
      </span>
    </div>
  );
};

export const FormInline = () => {
  const [value, setValue] = useState();
  const handleChange = (e) => setValue(e?.target?.value);
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="form-group __row">
        <div className="form-control">
          <label className="form-label" htmlFor="input-id-1-e" id="label-id-1-e">
            Label
          </label>
          <input
            className="form-input"
            id="input-id-1-e"
            type="text"
            placeholder="Text here..."
            aria-invalid="true"
            aria-labelledby="label-id-1-e"
            aria-describedby="helper-text-id-1-e"
            value={value}
            onChange={handleChange}
          />
          <span className="form-helper-text" id="helper-text-id-1-e">
            Helper text
          </span>
        </div>

        <div className="form-control">
          <label className="form-label" htmlFor="input-id-2-e" id="label-id-2-e">
            Label
          </label>
          <input
            className="form-input"
            id="input-id-2-e"
            type="password"
            placeholder="Text here..."
            aria-invalid="true"
            aria-labelledby="label-id-2-e"
            aria-describedby="helper-text-id-2-e"
            value={value}
            onChange={handleChange}
          />
          <span className="form-helper-text" id="helper-text-id-2-e">
            Helper text
          </span>
        </div>

        <Button type="button" shape="smooth">
          Submit
        </Button>
      </div>
    </form>
  );
};
