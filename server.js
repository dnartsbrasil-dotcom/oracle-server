package com.example.app.oracle

import android.util.Log
import com.example.app.ui.utils.RGBValues
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class OracleServerClient {

    private val serverUrl = "https://oracle-server-2dm5.onrender.com"

    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
    }

    suspend fun consultOracle(question: String): Result<OracleResponse> = withContext(Dispatchers.IO) {
        try {
            Log.d("OracleClient", "🔮 Consultando servidor: $serverUrl")

            val response = client.post("$serverUrl/oracleConsult") {
                contentType(ContentType.Application.Json)
                setBody(mapOf("question" to question))
            }

            val data: ServerOracleResponse = response.body()

            Log.d("OracleClient", "✅ Resposta recebida: ${data.bases.size} cartas")

            val cards = data.bases.map { base ->
                OracleCard(
                    codedName = base.symbol,
                    meaning = "${base.greekName}: ${base.meaning}",
                    position = 0
                )
            }

            Result.success(OracleResponse(
                cards = cards,
                interpretation = data.interpretation
            ))

        } catch (e: Exception) {
            Log.e("OracleClient", "❌ Erro ao consultar servidor: ${e.message}", e)
            Result.failure(e)
        }
    }

    suspend fun consultOracleWithImage(
        question: String,
        rgbValues: RGBValues
    ): Result<OracleImageResponse> {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("OracleClient", "🎨 Consultando servidor com RGB: R=${rgbValues.r}, G=${rgbValues.g}, B=${rgbValues.b}")

                val response: HttpResponse = client.post("$serverUrl/oracleConsultWithImage") {
                    contentType(ContentType.Application.Json)
                    setBody(mapOf(
                        "question" to question,
                        "rgbValues" to mapOf(
                            "r" to rgbValues.r,
                            "g" to rgbValues.g,
                            "b" to rgbValues.b
                        )
                    ))
                }

                if (response.status.isSuccess()) {
                    val data = response.body<OracleImageResponse>()
                    Log.d("OracleClient", "✅ Resposta com imagem recebida: ${data.cards.size} cartas")
                    Result.success(data)
                } else {
                    Log.e("OracleClient", "❌ Erro HTTP: ${response.status}")
                    Result.failure(Exception("Erro: ${response.status}"))
                }
            } catch (e: Exception) {
                Log.e("OracleClient", "❌ Erro na consulta com imagem: ${e.message}", e)
                Result.failure(e)
            }
        }
    }

    fun close() {
        client.close()
    }
}

// ✅ DATA CLASSES ORIGINAIS
@Serializable
data class ServerOracleResponse(
    val level: Int,
    val bases: List<ServerBase>,
    val interpretation: String,
    val timestamp: Long
)

@Serializable
data class ServerBase(
    val symbol: String,
    val greekName: String,
    val meaning: String
)

// ✅ DATA CLASSES PARA RESPOSTA COM IMAGEM (CORRIGIDAS!)
@Serializable
data class OracleImageResponse(
    val rgbValues: RGBValuesResponse,
    val cardNumbers: CardNumbersResponse,
    val cards: List<OracleCardWithSource>,
    val colorAnalysis: ColorAnalysisResponse,
    val questionLevel: Int,
    val interpretation: String,
    val timestamp: Long
)

@Serializable
data class RGBValuesResponse(
    val r: Int,
    val g: Int,
    val b: Int
)

@Serializable
data class CardNumbersResponse(
    val red: Int,
    val green: Int,
    val blue: Int
)

@Serializable
data class ColorAnalysisResponse(
    val dominantColor: String,
    val emotionalState: String,
    val energy: String
)

@Serializable
data class OracleCardWithSource(
    val symbol: String,
    val greekName: String,
    val meaning: String,
    val source: String,
    val calculation: String
)