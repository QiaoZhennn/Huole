import { ExchangeRatePayload } from '@app/server/core/payloads/ExchangeRatePayload'
import { exchangeRatePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'

// TODO: Refactor this code to use Cryptocompare API
// API URL: https://www.cryptocompare.com/api/data/coinlist/
// API Doc: https://www.cryptocompare.com/api/#-api-data-coinlist
const getExchangeRatesEvent: SocketEvent = {
  id: 'getTicker', // new_name: exchange_rate
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = exchangeRatePayloadValidator(payload) as boolean
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: ExchangeRatePayload): Promise<any> =>
    server.exchangesService.getExchangeRate(payload.symbol, payload.to)
}

export default getExchangeRatesEvent
