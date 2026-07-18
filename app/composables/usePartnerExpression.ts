import { ref, unref, type Ref, type ComputedRef } from "vue"
import type { Expression } from "~/data/types/partners"

export type ExpressionEvent = "correct" | "wrong" | "appreciated" | "smile" | "neutral"

export function usePartnerExpression(partner: Ref<any> | ComputedRef<any>) {
    const partnerExpression = ref<Expression>("netral")

    function getExpressionForEvent(event: ExpressionEvent): Expression {
        const isNara = unref(partner)?.name?.toLowerCase() === "nara"
        switch (event) {
            case "correct":
                return isNara ? "exicited" : "smile"
            case "wrong":
                return isNara ? "sad" : "sad"
            case "appreciated":
                return isNara ? "love" : "love"
            case "smile":
                return isNara ? "happy" : "smile"
            case "neutral":
            default: {
                const options: Expression[] = ["netral", "thinking1", "thinking2"]
                return options[Math.floor(Math.random() * options.length)]!
            }
        }
    }

    function setExpression(eventOrExpr: ExpressionEvent | Expression, resetAfterMs = 3000) {
        const eventsList: ExpressionEvent[] = ["correct", "wrong", "appreciated", "smile", "neutral"]
        let targetExpr: Expression

        if (eventsList.includes(eventOrExpr as ExpressionEvent)) {
            targetExpr = getExpressionForEvent(eventOrExpr as ExpressionEvent)
        } else {
            targetExpr = eventOrExpr as Expression
        }

        partnerExpression.value = targetExpr

        if (resetAfterMs > 0) {
            setTimeout(() => {
                partnerExpression.value = getExpressionForEvent("neutral")
            }, resetAfterMs)
        }
    }

    return {
        partnerExpression,
        setExpression,
        getExpressionForEvent
    }
}
