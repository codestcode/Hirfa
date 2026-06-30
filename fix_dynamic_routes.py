import glob
import os

routes = [
    "app/client/rate-review/[bookingId]/page.tsx",
    "app/client/addresses/edit/[id]/page.tsx",
    "app/client/order/cancel/[id]/page.tsx",
    "app/client/craftsman/[id]/page.tsx",
    "app/client/services/[categoryId]/page.tsx",
    "app/client/booking/[workerId]/page.tsx",
    "app/client/chat/[id]/page.tsx",
    "app/client/wallet/edit-card/[id]/page.tsx",
    "app/(main)/worker/booking/[id]/page.tsx",
    "app/(main)/worker/messages/[id]/page.tsx",
    "app/(onboarding)/intro/[step]/page.tsx"
]

code_to_add = "\n\nexport function generateStaticParams() {\n  return [];\n}\n"

for route in routes:
    if os.path.exists(route):
        with open(route, 'r') as f:
            content = f.read()
        if 'generateStaticParams' not in content:
            with open(route, 'a') as f:
                f.write(code_to_add)
            print(f"Fixed {route}")
        else:
            print(f"Skipped {route} (already has generateStaticParams)")
    else:
        print(f"Not found: {route}")

