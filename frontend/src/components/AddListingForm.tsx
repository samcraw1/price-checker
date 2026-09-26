import { useState, type SubmitEvent } from 'react'
import type { NewListing } from '../types'

type AddListingFormProps = {
  onAdd: (payload: NewListing) => Promise<void>
  submitting: boolean
}

const initialFormState = { name: '', url: '', imageUrl: '', price: '' }

export function AddListingForm({ onAdd, submitting }: AddListingFormProps) {
  const [form, setForm] = useState(initialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const price = Number(form.price)

    if (!form.name.trim() || !form.url.trim() || !form.imageUrl.trim() || !price) {
      setValidationError('Name, price, product URL, and image URL are all required.')
      return
    }

    setValidationError(null)
    await onAdd({
      name: form.name.trim(),
      price,
      url: form.url.trim(),
      imageUrl: form.imageUrl.trim(),
      priceHistory: [price],
    })
    setForm(initialFormState)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add a MacBook listing to track">
      <div className="field">
        <label htmlFor="listing-name">Name</label>
        <input
          id="listing-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="MacBook Pro 14-inch M4 Pro"
        />
      </div>

      <div className="field">
        <label htmlFor="listing-store">Store</label>
        <input id="listing-store" disabled placeholder="Not supported yet" />
        <p className="field-todo">⚠ Backend doesn't have a store field yet</p>
      </div>

      <div className="field">
        <label htmlFor="listing-url">Product URL</label>
        <input
          id="listing-url"
          type="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://www.apple.com/shop/buy-mac/..."
        />
      </div>

      <div className="field">
        <label htmlFor="listing-config">Configuration</label>
        <input id="listing-config" disabled placeholder="Not supported yet" />
        <p className="field-todo">⚠ Backend doesn't have RAM/storage/condition fields yet</p>
      </div>

      <div className="field">
        <label htmlFor="listing-image">Image URL</label>
        <input
          id="listing-image"
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="field">
        <label htmlFor="listing-price">Current price</label>
        <input
          id="listing-price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="1999.00"
        />
      </div>

      <div className="field">
        <label htmlFor="listing-target">Target price</label>
        <input id="listing-target" disabled placeholder="Not supported yet" />
        <p className="field-todo">⚠ Backend doesn't have a target_price field yet</p>
      </div>

      {validationError && <p className="feedback error" role="alert">{validationError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add listing'}
      </button>
    </form>
  )
}
