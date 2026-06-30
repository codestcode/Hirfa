import os
import glob
import re

routes = [
    "app/client/rate-review/[bookingId]",
    "app/client/addresses/edit/[id]",
    "app/client/order/cancel/[id]",
    "app/client/craftsman/[id]",
    "app/client/services/[categoryId]",
    "app/client/booking/[workerId]",
    "app/client/chat/[id]",
    "app/client/wallet/edit-card/[id]",
    "app/(main)/worker/booking/[id]",
    "app/(main)/worker/messages/[id]",
    "app/(onboarding)/intro/[step]"
]

for route in routes:
    page_path = os.path.join(route, "page.tsx")
    
    # extract parameter name
    match = re.search(r'\[([^\]]+)\]$', route)
    if not match:
        continue
    param_name = match.group(1)
    
    if route == "app/(onboarding)/intro/[step]":
        continue # intro is already fine with 1, 2, 3, 4
        
    new_page_content = f"""import ClientPage from './ClientPage';

export function generateStaticParams() {{
  return [{{ {param_name}: 'dummy' }}];
}}

export default function Page() {{
  return <ClientPage />;
}}
"""
    with open(page_path, 'w') as f:
        f.write(new_page_content)
    print(f"Updated {page_path} to return [{{ {param_name}: 'dummy' }}]")

