type PriceStatusBadgeProps = {
  price: number
  targetPrice?: number
}

// TODO(backend): the `listings` table has no target_price column and POST/PUT
// don't accept one, so there is never a real targetPrice to compare against yet.
// The comparison below is ready to go the moment the backend adds support —
// nothing else in this component needs to change.
export function PriceStatusBadge({ price, targetPrice }: PriceStatusBadgeProps) {
  if (targetPrice === undefined) {
    return (
      <span className="badge badge-neutral" title="Target price isn't supported by the backend yet">
        Not tracked
      </span>
    )
  }

  const atOrBelowTarget = price <= targetPrice

  return (
    <span className={atOrBelowTarget ? 'badge badge-good' : 'badge badge-neutral'}>
      {atOrBelowTarget ? 'At or below target' : 'Above target'}
    </span>
  )
}
