interface Props {
  action: string
  performedBy?: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

function TimelineItem({
  action,
  performedBy,
  oldValue,
  newValue,
  createdAt
}: Props) {

  return (

    <div className="relative">

      <span className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full"></span>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">

        <p className="text-sm font-medium text-gray-800">
          {action}
        </p>

        {performedBy && (
          <p className="text-xs text-gray-600 mt-1">
            Performed by <span className="font-semibold">{performedBy}</span>
          </p>
        )}

        {(oldValue || newValue) && (
          <div className="text-xs text-gray-600 mt-2">

            {oldValue && (
              <p>
                <span className="font-medium text-gray-500">Old:</span> {oldValue}
              </p>
            )}

            {newValue && (
              <p>
                <span className="font-medium text-gray-500">New:</span> {newValue}
              </p>
            )}

          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">
          {new Date(createdAt).toLocaleString()}
        </p>

      </div>

    </div>

  )
}

export default TimelineItem