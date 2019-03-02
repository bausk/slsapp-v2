import json
import sys
from getvars import get_variables


if __name__ == '__main__':
    # envs = sys.argv[1:]
    common, special = get_variables('production')
    for service, variables in special.items():
        final_varset = {**common, **variables}
        print('> Provisioning secrets for service {}...\n'.format(service))
        with open('./{}/secrets.json'.format(service), 'w') as secrets:
            json.dump(final_varset, secrets, sort_keys=True, indent=2)
